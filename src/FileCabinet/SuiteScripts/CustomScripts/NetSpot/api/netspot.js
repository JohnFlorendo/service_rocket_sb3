define(['N/record', 'N/https', 'N/search', 'N/url', 'N/format', './lib/timelineevent', '../../Helper/nsmapjson', './lib/deal', './lib/company', './lib/opportunity' ],
/**
 * @param {record} record
 */
function(record, https, search, url, format, timelineevent, nsmapjson, deal, company, opportunity) {
	
	var recHub = record.load({type:'customrecord_int_config_hubspot', id: 1});
	
	generateHubPayload = function (newRec){
		
		//log.audit({title: 'netspot.generateHubPayload: ' + newRec.id, details: 'entry'});
		
		var objMapping = {};
		
		if(['prospect', 'customer'].indexOf(newRec.type) > -1){
			objMapping = JSON.parse(recHub.getValue({fieldId: 'custrecord_nshs_customer'}).replace(/(\r\n|\n|\r)/gm,' '));
		}
		else if (newRec.type == 'contact'){
			
			if(newRec.getValue({fieldId: 'entityid'}).indexOf('(Chargebee)')){
				
			}
			else{
				objMapping = JSON.parse(recHub.getValue({fieldId: 'custrecord_nshs_contact'}).replace(/(\r\n|\n|\r)/gm,' '));	
			}
		}
		else if (newRec.type == 'opportunity'){
			objMapping = JSON.parse(recHub.getValue({fieldId: 'custrecord_nshs_deal'}).replace(/(\r\n|\n|\r)/gm,' '));
		}
		else if (newRec.type == 'customrecord_atl_marketplace_license'){
			objMapping = JSON.parse(recHub.getValue({fieldId: 'custrecord_nshs_license'}).replace(/(\r\n|\n|\r)/gm,' '));
		}
		else if (newRec.type == 'customrecord_atl_marketplace_transaction'){
			objMapping = JSON.parse(recHub.getValue({fieldId: 'custrecord_nshs_transaction'}).replace(/(\r\n|\n|\r)/gm,' '));
		}

		var objPayload = {};
		objPayload.properties = {};
		
		for (var key in objMapping ) {
			
			if(typeof objMapping[key] != 'object'){
				objPayload.properties[key] = objMapping[key];
			}
			else if(objMapping[key].hasOwnProperty('number')){
				objPayload.properties[key] = objMapping[key].number;
			}
			else if(objMapping[key].hasOwnProperty('value')){
				objPayload.properties[key] = newRec.getValue({fieldId: objMapping[key].value});
			}
			else if(objMapping[key].hasOwnProperty('text')){
				objPayload.properties[key] = newRec.getText({fieldId: objMapping[key].text});
			}
			else if(objMapping[key].hasOwnProperty('epoch')){
				
				if(newRec.getValue({fieldId: objMapping[key].epoch})){
					var dDate =   newRec.getValue({fieldId: objMapping[key].epoch});
					objPayload.properties[key] = dDate.getTime().toString();
				}
				else{
					objPayload.properties[key] = '';
				}
				
				if(objMapping[key].hasOwnProperty('ifnull') && objPayload.properties[key] == ''){
					
					var objIfNull = objMapping[key].ifnull;
					
					if(newRec.getValue({fieldId: objIfNull.epoch})){
						var dDate =  newRec.getValue({fieldId: objIfNull.epoch});
						objPayload.properties[key] = dDate.getTime().toString();
					}
					else{
						objPayload.properties[key] = '';
					}
				}
				
				
			}
			else if(objMapping[key].hasOwnProperty('split')){
				
				var objSplit = objMapping[key].split;
				var sSplitMe = '';
				var sValue = '';
				
				if(objSplit.hasOwnProperty('value')){
					sSplitMe += newRec.getValue({fieldId: objSplit.value});
				}
				else if(objSplit.hasOwnProperty('text')){
					sSplitMe += newRec.getText({fieldId: objSplit.text});
				}
				
				var arrSplit = sSplitMe.split(objSplit.delimiter);
				
				objSplit['return'].forEach(function(ret) {
					
						if(typeof ret == 'number'){
							sValue += arrSplit[ret];
						}
						else if(typeof ret == 'string'){
							
							sValue += ret;
						}
						else if(ret instanceof Array){
							
							var arrSub = ret;
							
							if(arrSub.length > 0 && arrSub.length <= 2){
								
								if(arrSub.length == 1 && arrSub[0] >= 0){
									for (var idx = arrSub[0]; idx < arrSplit.length; idx++) {
										sValue += arrSplit[idx] + objSplit.delimiter;
									}
								}
								else if(arrSub.length == 1 && arrSub[0] < 0){
								
									var nStart = arrSplit.length + arrSub[0];
									
									for (var idx = nStart; idx < arrSplit.length; idx++) {
										sValue += arrSplit[idx] + objSplit.delimiter;
									}
								}
								else if(arrSub.length > 0){
									
									for (var idx =  arrSub[0] ; idx <= arrSub[1]; idx++) {
										sValue += arrSplit[idx] + objSplit.delimiter;
									}
								}
							}
						}
					}
				);
				
				objPayload.properties[key] = sValue.trim();
			}
			else if(objMapping[key].hasOwnProperty('concat')){
				
				var objConcats = objMapping[key].concat;
				var sValue = '';
				
				objConcats.forEach(function(objConcat) {
					
					if(typeof objConcat != 'object'){
						sValue += objConcat;
					}
					else if(objConcat.hasOwnProperty('number')){
						sValue += objConcat.number;
					}
					else if(objConcat.hasOwnProperty('value')){
						sValue += newRec.getValue({fieldId: objConcat.value});
					}
					else if(objConcat.hasOwnProperty('text')){
						sValue += newRec.getText({fieldId: objConcat.text});
					}
				});
				
				objPayload.properties[key] = sValue;
			}
		}
		
		//log.audit({title: 'netspot.generateHubPayload: ' + newRec.id, details: 'exit: '+  JSON.stringify(objPayload)});
		
		return objPayload;
	};
	
	generateHubCard = function(requestParams, card){
		
		var src;
		var res;
		var arrCardInfo = [];
		var newRec;
		
		try{
			
			if(card == 'opportunity'){
				
				src = search.create({type: 'transaction', columns: ['internalid']});
	    			src.filters = [];
	    			src.filters.push(search.createFilter({name: 'custbody_hubspot_id', operator: 'is', values: requestParams.hs_object_id}));
	    			src.filters.push(search.createFilter({name: 'mainline', operator: 'is', values: true}));
	    		res = getAllResults(src);

				objMapping = JSON.parse(recHub.getValue({fieldId: 'custrecord_nshs_oppcard'}).replace(/(\r\n|\n|\r)/gm,' '));
			}
			else if(card == 'customer'){
				
				src = search.create({type: 'job', columns: ['internalid']});
					src.columns.push(search.createColumn({name: 'companyname'}));
					src.columns.push(search.createColumn({name: 'startdate'}));
					src.columns.push(search.createColumn({name: 'entitystatus'}));
					src.columns.push(search.createColumn({name: 'projectmanager'}));
					src.columns.push(search.createColumn({name: 'custentity_sr_box_folder_url'}));

					src.filters = [];
					src.filters.push(search.createFilter({name: 'custentity_hubspot_id', join: 'customer', operator: 'is', values: requestParams.associatedObjectId}));

				res = getAllResults(src);
		      
				log.audit({title: 'netspot.generateHubCard: res len ' + res.length});
				
				objMapping = JSON.parse(recHub.getValue({fieldId: 'custrecord_nshs_jobcard'}).replace(/(\r\n|\n|\r)/gm,' '));
			}
			else{
				return;
			}
		}
		catch(err){
			
			log.audit('ERROR', err);
			return {'message': 'error ' +  err};
		}

		if(res == undefined){
			return {'message': 'record not found'};
		}
		
		res.forEach(function(result) {
			
			if(card == 'opportunity'){
				newRec = record.load({type: 'opportunity', id: result.id});	
			}
			else if(card == 'customer'){
				newRec = result;
			}
			
			var objCardInfo = {};
			var	arrProperties = [];

			for (var key in objMapping ) {
				
				var objMapValue;
				
				if(card == 'opportunity'){
					objMapValue = getMappingRecordValue(objMapping, key, newRec);
				}
				else if(card == 'customer'){
					objMapValue = getMappingSearchValue(objMapping, key, newRec);
				}

				
				if(objMapValue.type == 'info'){
					objCardInfo[key] = objMapValue.value;
				}
				else if(objMapValue.type == 'prop'){
					arrProperties.push(objMapValue.value);
				}
			}
          
			if(card == 'opportunity'){
				
	          	if(newRec.getLineCount({sublistId: 'closed'}) > 0){
					
					for(var nLine =0; nLine < newRec.getLineCount({sublistId: 'closed'}) ; nLine++){
						
						if(newRec.getSublistValue({sublistId: 'closed', fieldId: 'type', line: nLine}) == 'Sales Order'){
						
							var recSo = record.load({type: 'salesorder', id: newRec.getSublistValue({sublistId: 'closed', fieldId: 'closeid', line: nLine})});
						
							objProperty = {};
							
							objProperty.label = 'Sales Order #';
							objProperty.dataType = 'STRING';
							objProperty.value = recSo.getValue({fieldId: 'tranid'});
							arrProperties.push(objProperty);
						  
							objProperty = {};
							objProperty.label = 'PO #';
							objProperty.dataType = 'STRING';
							objProperty.value = recSo.getValue({fieldId: 'otherrefnum'});
							arrProperties.push(objProperty);
							
							objProperty = {};
							objProperty.label = 'Sales Order Date';
							objProperty.dataType = 'STRING';
							objProperty.value = recSo.getText({fieldId: 'trandate'});
							arrProperties.push(objProperty);
							
							objProperty = {};
							objProperty.label = 'Sales Order Total';
							objProperty.dataType = 'CURRENCY';
							objProperty.value = recSo.getValue({fieldId: 'total'}).toString();
							objProperty.currencyCode = recSo.getValue({fieldId: 'currencysymbol'});
							arrProperties.push(objProperty);
							
							objProperty = {};
							objProperty.label = 'Amount (Before GST)';
							objProperty.dataType = 'CURRENCY';
							
							var nSubTotal = recSo.getValue({fieldId: 'custpage_subtotal'});
							
							if(nSubTotal){
								nSubTotal = nSubTotal.toString();
							}
							else{
								nSubTotal = '';
							}
							
							objProperty.value = nSubTotal;
							objProperty.currencyCode = recSo.getValue({fieldId: 'currencysymbol'});
							arrProperties.push(objProperty);
							
							objProperty = {};
							objProperty.label = 'Tax Amount';
							objProperty.dataType = 'CURRENCY';
							
							var nTaxAmount = recSo.getValue({fieldId: 'custpage_taxamount'});
							
							if(nTaxAmount){
								nTaxAmount = nTaxAmount.toString();
							}
							else{
								nTaxAmount = '';
							}
							objProperty.value = nTaxAmount;
							objProperty.currencyCode = recSo.getValue({fieldId: 'currencysymbol'});
							arrProperties.push(objProperty);
							
							objProperty = {};
							objProperty.label = 'Amount Invoiced';
							objProperty.dataType = 'CURRENCY';
							
							var nInvoicedAmount = recSo.getValue({fieldId: 'custpage_amountinvoiced'});
							
							if(nTaxAmount){
								nInvoicedAmount = nInvoicedAmount.toString();
							}
							else{
								nInvoicedAmount = '';
							}
							
							objProperty.value = nInvoicedAmount;
							objProperty.currencyCode = recSo.getValue({fieldId: 'currencysymbol'});
							arrProperties.push(objProperty);
							
							objProperty = {};
							objProperty.label = 'Amount Remaining';
							objProperty.dataType = 'CURRENCY';
							
							var nRemainAmount = recSo.getValue({fieldId: 'custpage_amountremaining'});
							
							if(nRemainAmount){
								nRemainAmount = nRemainAmount.toString();
							}
							else{
								nRemainAmount = '';
							}

							objProperty.value = nRemainAmount;
							objProperty.currencyCode = recSo.getValue({fieldId: 'currencysymbol'});
							arrProperties.push(objProperty);
						}
					}
				}
	          	
	          	objCardInfo.link = 'https://3688201.app.netsuite.com' + url.resolveRecord({recordType: 'opportunity', recordId: newRec.id});
	          	
				objCardInfo.actions = [];
				
				log.audit({
					title: 'netspot' ,
					details: 'hubcard: ' + requestParams.hs_lastmodifieddate + ' == ' + newRec.getValue({fieldId: 'custbody_hubspot_hs_lastmodifieddate'})
				});
				
				if(requestParams.hs_lastmodifieddate == newRec.getValue({fieldId: 'custbody_hubspot_hs_lastmodifieddate'})){
					objProperty = {};
					objProperty.label = 'Sync Status';
					objProperty.dataType = 'STATUS';
					objProperty.value = 'IN SYNC';
					objProperty.optionType = 'SUCCESS';
					arrProperties.unshift(objProperty);              
				}
				else{
					objProperty = {};
					objProperty.label = 'Sync Status';
					objProperty.dataType = 'STATUS';
					objProperty.value = 'OUT OF SYNC';
					objProperty.optionType = 'DANGER';
					arrProperties.unshift(objProperty);
					
					var objPushAction = {
							   "type":"CONFIRMATION_ACTION_HOOK",
							   "httpMethod":"POST",
							   "uri":"https://us-central1-pmo-408-netsuite-to-hubspot.cloudfunctions.net/netsuite-opportunity-update-1",
							   "label":"Push to NetSuite",
							   "associatedObjectProperties":["dealId"],
							   "confirmationMessage":"Are you sure you want to update this Opportunity in NetSuite?",
							   "confirmButtonText":"Yes",
							   "cancelButtonText":"No"
							};
					objCardInfo.actions.push(objPushAction);
				}
				
				objCardInfo.properties = arrProperties;

				if(newRec.getValue({fieldId: 'custbody_box_url'}) != ''){
					
					var sBoxUrl = newRec.getValue({fieldId: 'custbody_box_url'});
						sBoxUrl = sBoxUrl.replace('/folder', '/embed/folder');
						sBoxUrl = sBoxUrl.replace('com/s', 'com/embed/s');
					
					objCardInfo.actions.unshift(
					     		            {
					     		            	"type":"IFRAME",
					     		               "width":890,
					     		               "height":748,
					     		               "uri": sBoxUrl,
					     		               "label":"View Box Folder",
					     		               "associatedObjectProperties":[]
					     		            }
					     		         );
				}
			}
			else if(card == 'customer'){
				
				objCardInfo.link = 'https://3688201.app.netsuite.com' + url.resolveRecord({recordType: 'job', recordId: newRec.id});
				objCardInfo.properties = arrProperties;
				objCardInfo.actions = [];
				
				if(newRec.getValue({name: 'custentity_sr_box_folder_url'}) != ''){
					
					var sBoxUrl = newRec.getValue({name: 'custentity_sr_box_folder_url'});
						sBoxUrl = sBoxUrl.replace('/folder', '/embed/folder');
						
					objCardInfo.actions.unshift(
					     		            {
					     		               "type":"IFRAME",
					     		               "width":890,
					     		               "height":748,
					     		               "uri": sBoxUrl,
					     		               "label":"View Box Folder",
					     		               "associatedObjectProperties":[]
					     		            }
					     		         );
				}
			}

			arrCardInfo.push(objCardInfo);
		    return true;
		});
				
		//log.audit({title: 'netspot.generateHubCard: ' + hubspotid, details: 'exit: '+  JSON.stringify(arrCardInfo)});
		
		return {results: arrCardInfo};
	};
	
	generateNetSuitePayload = function(newRec, objMapping){
		
		var sMainUrl = recHub.getValue({fieldId: 'custrecord_nshs_endpoint'});
		var sKey = recHub.getValue({fieldId: 'custrecord_nshs_apikey'});
		var objHeader = {'Content-Type': 'application/json', 'Accept': '*/*'};
		
		if(['prospect', 'customer'].indexOf(newRec.type) > -1){
			hsType = 'companies';	
		}
		else if(newRec.type == 'contact'){
			hsType = 'contacts';
		}
		else if(newRec.type == 'opportunity'){
			hsType = 'deals';
		}
		else if(newRec.type == 'customrecord_atl_marketplace_license'){
			hsType = 'timelineevent';
		}
	
		var sUrl = sMainUrl + hsType +'/' + newRec.getValue({fieldId: 'custbody_hubspot_id'}) + '?hapikey=' + sKey;
		var objResp = https.get({url: sUrl, headers: objHeader});
		
		if(objResp.code == 200){
			
			log.audit({ title: 'generateNetSuitePayload', details: 'response: ' + objResp.body});
			
			var objProperties = JSON.parse(objResp.body).properties;
			
			
			for (var key in objMapping ) {
				
				if(objMapping[key].hasOwnProperty('value')){
					newRec.setValue({fieldId: objMapping[key].value, value : objProperties[key]});
				}
				else if(objMapping[key].hasOwnProperty('text')){
					newRec.setText({fieldId: objMapping[key].text, text : objProperties[key]});
				}
				else if(objMapping[key].hasOwnProperty('epoch')){
					var dDate =   new Date(objProperties[key]);
					newRec.setValue({fieldId: objMapping[key].epoch, value : dDate.getTime().toString()});
				}
				else if(objMapping[key].hasOwnProperty('date')){
					
					
					if(objProperties[key].indexOf('.') == -1){
						objProperties[key] = objProperties[key].replace('Z', '.000Z');
					}
					
					var dDate = format.parse({ value: new Date(objProperties[key]), type: format.Type.DATE});
					newRec.setValue({fieldId: objMapping[key].date, value : dDate});
				}
			}
			
			return newRec;
		}
		else{
			return objResp;
		}
		
		
	};

	sendHubRequest = function(newRec){
		
		var NSPIPELINE = 1;
		var RENEWPIPLINE = 2;
		var PROPOSAL = 10;
		var idHs;
		var fldHsId = '';
		var fldHsUpdate = '';
		var fldHsLogs = '';
		var hsType = '';
		var sMainUrl = recHub.getValue({fieldId: 'custrecord_nshs_endpoint'});
		var sKey = recHub.getValue({fieldId: 'custrecord_nshs_apikey'});
		var objHeader = {'Content-Type': 'application/json', 'Accept': '*/*'};
		var objPropPayload = generateHubPayload(newRec);
		var objPayload = {};
		
		if(['prospect', 'customer'].indexOf(newRec.type) > -1){
			fldHsId = 'custentity_hubspot_id';
			fldHsLogs = 'custentity_nshs_logs';
			hsType = 'companies';	
		}
		else if(newRec.type == 'contact'){
			fldHsId = 'custentity_hubspot_id';
			fldHsLogs = 'custentity_nshs_logs';
			hsType = 'contacts';
		}
		else if(newRec.type == 'opportunity'){
			fldHsId = 'custbody_hubspot_id';
			fldHsLogs = 'custbody_nshs_logs';
			fldHsUpdate = 'custbody_hubspot_hs_lastmodifieddate';
			hsType = 'deals';
			
			if(newRec.getValue({fieldId : 'custbody_sr_pipeline'}) == NSPIPELINE){
				
				if(newRec.getValue({fieldId : 'entitystatus'}) == PROPOSAL){
					objPropPayload.properties.dealstage = '10';
				}
			}
			else if(newRec.getValue({fieldId : 'custbody_sr_pipeline'}) == RENEWPIPLINE){

				if(newRec.getValue({fieldId : 'entitystatus'}) == PROPOSAL){
					objPropPayload.properties.dealstage = '13110520';
				}
				else if(newRec.getValue({fieldId : 'entitystatus'}) == 13){
					objPropPayload.properties.dealstage = '2330412';
				}
				else if(newRec.getValue({fieldId : 'entitystatus'}) == 14){
					objPropPayload.properties.dealstage = '2330413';
				}
			}
		}
		else if(newRec.type == 'customrecord_atl_marketplace_license' && newRec.getValue({fieldId: 'custrecord_lic_type'}) == 1){
			hsType = 'timelineevent';
		}
		else if(newRec.type == 'customrecord_atl_marketplace_license' && newRec.getValue({fieldId: 'custrecord_lic_type'}) == 2){
			//exclude CB Subscription
			return newRec;
		}
		else if(newRec.type == 'customrecord_atl_marketplace_transaction' && newRec.getValue({fieldId: 'custrecord_mp_type'}) == 1){
			hsType = 'timelineevent';
		}
		else if(newRec.type == 'customrecord_atl_marketplace_transaction' && newRec.getValue({fieldId: 'custrecord_mp_type'}) == 2){
			//exclude CB Transaction
			return newRec;
		}
		
		if(hsType == 'timelineevent'){

			//custrecord_nshs_token
			
			//log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'Put timeline event'});
			
			sUrl = 'https://api.hubapi.com/integrations/v1/222211/timeline/event';
			
			objPayload = objPropPayload.properties;

			
			if(newRec.type == 'customrecord_atl_marketplace_license'){
				objPayload.timelineIFrame = {
			            "linkLabel": "View in NetSuite",
			            "iframeLabel": "NetSuite",
			            "iframeUri": "https://3688201.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=706&id=" + newRec.id,
			            "width": 800,
			            "height": 600
			        };
			}
			else if(newRec.type == 'customrecord_atl_marketplace_transaction'){
				
				objPayload.timelineIFrame = {
			            "linkLabel": "View in NetSuite",
			            "iframeLabel": "NetSuite",
			            "iframeUri": "https://3688201.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=375&id=" + newRec.id,
			            "width": 800,
			            "height": 600
			        };
			}
			
			log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'payload: ' + JSON.stringify(objPayload)});
			
			var idCompany = objPayload.companyId;
			var idTech = objPayload.techContactId;
			var idBill = objPayload.billContactId;
			var idEvent = objPayload.id;
			
			delete objPayload['companyId'];
			delete objPayload['techContactId'];
			delete objPayload['billContactId'];
			
			objHeader.Authorization = 'Bearer ' + recHub.getValue({fieldId :'custrecord_nshs_token'});
			objPayload.objectId = idTech;
			objPayload.id = idEvent + '-TC';

			var objResp = https.put({url: sUrl, body: JSON.stringify(objPayload), headers: objHeader});
			
			//log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'response: ' + objResp.code});
			//log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'idCompany: ' + idCompany});
			
			
			if(idCompany){
				//1005911 
				objPayload.objectId = idCompany;
				
				if(newRec.type == 'customrecord_atl_marketplace_license'){
					objPayload.eventTypeId = 1005722;
				}
				else if(newRec.type == 'customrecord_atl_marketplace_transaction'){
					objPayload.eventTypeId = 1005911;
				}

				objPayload.id = idEvent;
				
				log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'payload: ' + JSON.stringify(objPayload)});
				
				var objResp = https.put({url: sUrl, body: JSON.stringify(objPayload), headers: objHeader});
				
				log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'response: ' + objResp.code});
				
				if(objResp.code == 200){
					
					log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'Update HS'});
					var objBody = JSON.parse(objResp.body);
				}
				else{
					newRec.setValue({fieldId: 'custentity_nshs_logs', value: objResp.code + ':' + objResp.body});
				}
			}
			
			if(idBill){
 
				objPayload.objectId = idBill;

				if(newRec.type == 'customrecord_atl_marketplace_license'){
					objPayload.eventTypeId = 1005723;
				}
				else if(newRec.type == 'customrecord_atl_marketplace_transaction'){
					objPayload.eventTypeId = 1005711;
				}
				
				objPayload.id = idEvent + '-BC';
				
				var objResp = https.put({url: sUrl, body: JSON.stringify(objPayload), headers: objHeader});
				if(objResp.code == 200){
					
					log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'Update HS 2'});
					var objBody = JSON.parse(objResp.body);
				}
				else{
					newRec.setValue({fieldId: 'custentity_nshs_logs', value: objResp.code + ':' + objResp.body});
				}
			}
		}
		else if(((newRec.getValue({fieldId: 'custentity_hubspot_id'}) == '' ||
				newRec.getValue({fieldId: 'custentity_hubspot_id'}) == null) && ['contact', 'prospect', 'customer'].indexOf(newRec.type) > -1) || 
				((newRec.getValue({fieldId: 'custbody_hubspot_id'}) == '' ||
				newRec.getValue({fieldId: 'custbody_hubspot_id'}) == null) && ['opportunity'].indexOf(newRec.type) > -1)){
			

			log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'empty hubspot id'});
			var objNameFilter = {};
			
			if(['prospect', 'customer'].indexOf(newRec.type) > -1){
				objNameFilter.propertyName = 'name';
				objNameFilter.operator = 'EQ';
				objNameFilter.value = objPropPayload.properties.name;
			}
			else if(newRec.type == 'contact'){
				objNameFilter.propertyName = 'email';
				objNameFilter.operator = 'EQ';
				objNameFilter.value = objPropPayload.properties.email;
			}
			else if (newRec.type == 'opportunity'){
				objNameFilter.propertyName = 'dealname';
				objNameFilter.operator = 'EQ';
				objNameFilter.value = objPropPayload.properties.dealname;
			}

			var objSearchPayload = {};
				objSearchPayload.filterGroups = [{'filters': [objNameFilter]}];
				objSearchPayload.limit = 1;
				
			sUrl = sMainUrl + hsType +'/search?hapikey=' + sKey;
			
			var objResp = https.post({url: sUrl, body: JSON.stringify(objSearchPayload), headers: objHeader});
			
			if(objResp.code == 200){
			
				log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'HS searched'});
				
				var objBody = JSON.parse(objResp.body);
				
				log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'objResp: ' + objResp.body});
				
				if(parseInt(objBody.total) > 0){
					
					log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'Update HS 3'});
					
					sUrl = sMainUrl + hsType +'/batch/update?hapikey=' + sKey;
					
					objPayload.inputs = [];
					objPayload.inputs.push ({id: objBody.results[0].id, properties: objPropPayload.properties });
						
					var objResp = https.post({url: sUrl, body: JSON.stringify(objPayload), headers: objHeader});
					
					log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'objResp: ' + objResp.body});
					
					
					
					if(objResp.code == 200){
						
						var objBody = JSON.parse(objResp.body);
						var objResult;

						if(objBody.results.length > 0){
							
							objResult = objBody.results[0];
                            idHs =  objResult.id;
    						newRec.setValue({fieldId: fldHsId, value: idHs});
    						newRec.setValue({fieldId: fldHsUpdate, value: new Date(objResult.properties.hs_lastmodifieddate).getTime().toString()});
    						
    						///Association
    						if(newRec.type == 'opportunity'){
    							sUrl = sMainUrl + hsType + '/' + idHs + '/associations/companies/' + newRec.getValue({fieldId: 'custbody_hubspot_customer_id'})+'/5?hapikey=' + sKey;
    							var objResp = https.put({url: sUrl, headers: objHeader});
    							log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'objResp: '+ objResp.body});
    						}
    						newRec.setValue({fieldId: fldHsLogs, value: 'HS Updated'});
						}
						
						
					}
					else{
						newRec.setValue({fieldId: fldHsLogs, value: objResp.code + ':' + objResp.body});
					}
				}
				else{
					
					log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'New HS'});
					
					sUrl = sMainUrl + hsType +'?hapikey=' + sKey;
					objPayload = objPropPayload;
					
					var objResp = https.post({url: sUrl, body: JSON.stringify(objPayload), headers: objHeader});
					
					log.audit({title: 'netspot.sendHubRequest: ' + newRec.id , details: 'objPayload: ' + JSON.stringify(objPayload)});
					
					if(objResp.code == 201){
						
						log.audit({title: 'netspot.sendHubRequest: ' + newRec.id , details: 'Created HS'});
						log.audit({title: 'netspot.sendHubRequest: ' + newRec.id , details: 'response: ' + objResp.body});
						
						var objBody = JSON.parse(objResp.body);
						var objResult;

						if(objBody != undefined){
							
							if(objBody != undefined){
							
								if(objBody.results != undefined){
									
									objResult = objBody.results[0];
		                            idHs =  objResult.id;
		                            
		    						newRec.setValue({fieldId: fldHsId, value: idHs});
		    						newRec.setValue({fieldId: fldHsUpdate, value: new Date(objBody.properties.hs_lastmodifieddate).getTime().toString()});
	
		    						///Association
		    						if(newRec.type == 'contact'){
		    							//sUrl = sMainUrl + hsType + '/' + idHs + '/associations/companies/' + newRec.getValue({fieldId: 'custbody_hubspot_customer_id'})+'/5?hapikey=' + sKey;
		    							//var objResp = https.put({url: sUrl, headers: objHeader});
		    						}
		    						else if(newRec.type == 'opportunity'){
		    							sUrl = sMainUrl + hsType + '/' + idHs + '/associations/companies/' + newRec.getValue({fieldId: 'custbody_hubspot_customer_id'})+'/5?hapikey=' + sKey;
		    							var objResp = https.put({url: sUrl, headers: objHeader});
		    						}
		    						
		    						newRec.setValue({fieldId: fldHsLogs, value: 'HS Updated'});
								}
								else if (objBody.id){
									
									objResult = objBody;
		                            idHs =  objResult.id;
		                            
		    						newRec.setValue({fieldId: fldHsId, value: idHs});
		    						newRec.setValue({fieldId: fldHsUpdate, value: new Date(objBody.properties.hs_lastmodifieddate).getTime().toString()});
	
		    						///Association
		    						if(newRec.type == 'opportunity'){
		    							sUrl = sMainUrl + hsType + '/' + idHs + '/associations/companies/' + newRec.getValue({fieldId: 'custbody_hubspot_customer_id'})+'/5?hapikey=' + sKey;
		    							var objResp = https.put({url: sUrl, headers: objHeader});
		    							
		    							log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'objResp: '+ objResp.body});
		    						}
		    						
		    						newRec.setValue({fieldId: fldHsLogs, value: 'HS Updated'});
								}
							}
						}
					}
					else{
						newRec.setValue({fieldId: fldHsLogs, value: objResp.code + ':' + objResp.body});
					}
				}
			}
		}
		else{
			
			log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'Update HS 4'});
			
			sUrl = sMainUrl + hsType +'/batch/update?hapikey=' + sKey;
			
			objPayload.inputs = [];
			objPayload.inputs.push ({id: newRec.getValue({fieldId: fldHsId}), properties: objPropPayload.properties });
			
			var objResp = https.post({url: sUrl, body: JSON.stringify(objPayload), headers: objHeader});
			
			if(objResp.code == 200){
				
				log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'Update HS 5'});
				var objBody = JSON.parse(objResp.body);
				var objResult;
				log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'objResp: '+ objResp.body});
				if(objBody.results.length > 0){
					
					objResult = objBody.results[0];
					idHs =  objResult.id;
					newRec.setValue({fieldId: fldHsId, value: idHs});
					newRec.setValue({fieldId: fldHsUpdate, value: new Date(objResult.properties.hs_lastmodifieddate).getTime().toString()});
					
					///Association
					if(newRec.type == 'contact'){
						//sUrl = sMainUrl + hsType + '/' + idHs + '/associations/companies/' + newRec.getValue({fieldId: 'custbody_hubspot_customer_id'})+'/5?hapikey=' + sKey;
						//var objResp = https.put({url: sUrl, headers: objHeader});
					}
					else if(newRec.type == 'opportunity'){
						sUrl = sMainUrl + hsType + '/' + idHs + '/associations/companies/' + newRec.getValue({fieldId: 'custbody_hubspot_customer_id'})+'/5?hapikey=' + sKey;
						var objResp = https.put({url: sUrl, headers: objHeader});
						
						log.audit({title: 'netspot.sendHubRequest: ' + newRec.id, details: 'objResp: '+ objResp.body});
						
					}
					
					newRec.setValue({fieldId: fldHsLogs, value: 'HS Updated.'});
				}
			}
			else{
				newRec.setValue({fieldId: fldHsLogs, value: objResp.code + ':' + objResp.body});
			}
		}
		
		return newRec;
	};
		
	getHubRequest = function(requestBody) {

		var src;
		var rec;
		var retMe;
		
		if(requestBody.associatedObjectType = 'DEAL'){
			
			if(requestBody.associatedObjectId != undefined && requestBody.associatedObjectId != ''){
				src = search.create({type: 'transaction', columns: ['internalid']});
					src.filters = [];
					src.filters.push(search.createFilter({name: 'custbody_hubspot_id', operator: 'is', values: requestBody.associatedObjectId}));
					src.filters.push(search.createFilter({name: 'mainline', operator: 'is', values: true}));
				res = getAllResults(src);
	
				objMapping = JSON.parse(recHub.getValue({fieldId: 'custrecord_hsns_deal'}).replace(/(\r\n|\n|\r)/gm,' '));
			
				if(res.length > 0){
					
					rec = record.load({type: 'opportunity', id: res[0].id });
					
					log.audit({title: 'getHubRequest', details: 'opps: loaded'});
					
					rec = generateNetSuitePayload(rec, objMapping);
					var id = rec.save();
					
					retMe = {'message': 'Deal Updated Successfully. Please Refresh!'};
					
				}
				else{
					retMe = {'error': 'associatedObjectId is missing' };
				}
			}
			else{
				retMe = {'error': 'associatedObjectId is missing' };
			}
		}
		else{
			retMe = {'message': 'no existing mapping' };
		}
		
		return retMe;
		
	};

	getMappingRecordValue = function(objMapping, key, newRec){

		var retMe = {}; 
		var objProperty = {};
		
		if(typeof objMapping[key] != 'object'){
			retMe = {type: 'info', value: objMapping[key]}
		}
		else if(objMapping[key].hasOwnProperty('value')){
			
			if(objMapping[key].hasOwnProperty('property')){

				objProperty.label = objMapping[key].label;
				objProperty.dataType = 'STRING';
				objProperty.value = newRec.getValue({fieldId: objMapping[key].value});
				retMe = {type: 'prop', value: objProperty};
			}
			else{
				retMe = {type: 'info', value: newRec.getValue({fieldId: objMapping[key].value})};
			}
		}
		else if(objMapping[key].hasOwnProperty('date')){
			
			var dDate = newRec.getValue({fieldId: objMapping[key].date})

			if(objMapping[key].hasOwnProperty('property')){

				objProperty.label = objMapping[key].label;
				objProperty.dataType = 'STRING';
				objProperty.value = dDate.getFullYear() + '-' + (parseInt(dDate.getMonth()) + 1) + '-' + dDate.getDate();
				retMe = {type: 'prop', value: objProperty};
			}
			else{
				retMe = {type: 'info', value: dDate.getFullYear() + '-' + (parseInt(dDate.getMonth()) + 1) + '-' + dDate.getDate()};
			}
		}
		else if(objMapping[key].hasOwnProperty('text')){
			
			if(objMapping[key].hasOwnProperty('property')){

				objProperty.label = objMapping[key].label;
				objProperty.dataType = 'STRING';
				objProperty.value = newRec.getText({fieldId: objMapping[key].text});
				retMe = {type: 'prop', value: objProperty};
			}
			else{
				retMe = {type: 'info', value: newRec.getText({fieldId: objMapping[key].text})};
			}
		}
		else if(objMapping[key].hasOwnProperty('currency')){

			if(objMapping[key].hasOwnProperty('property')){

				objProperty.label = objMapping[key].label;
				objProperty.dataType = 'CURRENCY';
				objProperty.value = newRec.getValue({fieldId: objMapping[key].currency}).toString();
				objProperty.currencyCode = newRec.getValue({fieldId: 'currencysymbol'});
				retMe = {type: 'prop', value: objProperty};
			}
			else{
				retMe = {type: 'info', value: newRec.getValue({fieldId: objMapping[key].currency})};
			}
		}
		else if(objMapping[key].hasOwnProperty('concat')){
			
			var objConcats = objMapping[key].concat;
			var sValue = '';
			
			objConcats.forEach(function(objConcat) {
				
				if(typeof objConcat != 'object'){
					sValue += objConcat;
				}
				else if(objConcat.hasOwnProperty('number')){
					sValue += objConcat.number;
				}
				else if(objConcat.hasOwnProperty('value')){
					sValue += newRec.getValue({fieldId: objConcat.value});
				}
				else if(objConcat.hasOwnProperty('text')){
					sValue += newRec.getText({fieldId: objConcat.text});
				}
			});
			retMe = {type: 'info', value: sValue};
		}
			
		return retMe;
	};
	
	getMappingSearchValue = function(objMapping, key, newRec){
		
		var retMe = {}; 
		var objProperty = {};
		
		if(typeof objMapping[key] != 'object'){
			retMe = {type: 'info', value: objMapping[key]}
		}
		else if(objMapping[key].hasOwnProperty('value')){
			
			if(objMapping[key].hasOwnProperty('property')){

				objProperty.label = objMapping[key].label;
				objProperty.dataType = 'STRING';
				objProperty.value = newRec.getValue({name: objMapping[key].value});
				retMe = {type: 'prop', value: objProperty};
			}
			else{
				retMe = {type: 'info', value: newRec.getValue({name: objMapping[key].value})};
			}
		}
		else if(objMapping[key].hasOwnProperty('date')){
			
			var dDate = newRec.getValue({name: objMapping[key].date})

			if(objMapping[key].hasOwnProperty('property')){

				objProperty.label = objMapping[key].label;
				objProperty.dataType = 'STRING';
				//objProperty.value = dDate.getFullYear() + '-' + (parseInt(dDate.getMonth()) + 1) + '-' + dDate.getDate();
				retMe = {type: 'prop', value: dDate};
			}
			else{
				//retMe = {type: 'info', value: dDate.getFullYear() + '-' + (parseInt(dDate.getMonth()) + 1) + '-' + dDate.getDate()};
				retMe = {type: 'info', value: dDate};
			}
		}
		else if(objMapping[key].hasOwnProperty('text')){
			
			if(objMapping[key].hasOwnProperty('property')){

				objProperty.label = objMapping[key].label;
				objProperty.dataType = 'STRING';
				objProperty.value = newRec.getText({name: objMapping[key].text});
				retMe = {type: 'prop', value: objProperty};
			}
			else{
				retMe = {type: 'info', value: newRec.getText({name: objMapping[key].text})};
			}
		}
		else if(objMapping[key].hasOwnProperty('currency')){

			if(objMapping[key].hasOwnProperty('property')){

				objProperty.label = objMapping[key].label;
				objProperty.dataType = 'CURRENCY';
				objProperty.value = newRec.getValue({name: objMapping[key].currency}).toString();
				objProperty.currencyCode = newRec.getValue({name: 'currencysymbol'});
				retMe = {type: 'prop', value: objProperty};
			}
			else{
				retMe = {type: 'info', value: newRec.getValue({name: objMapping[key].currency})};
			}
		}
		else if(objMapping[key].hasOwnProperty('concat')){
			
			var objConcats = objMapping[key].concat;
			var sValue = '';
			
			objConcats.forEach(function(objConcat) {
				
				if(typeof objConcat != 'object'){
					sValue += objConcat;
				}
				else if(objConcat.hasOwnProperty('number')){
					sValue += objConcat.number;
				}
				else if(objConcat.hasOwnProperty('value')){
					sValue += newRec.getValue({name: objConcat.value});
				}
				else if(objConcat.hasOwnProperty('text')){
					sValue += newRec.getText({name: objConcat.text});
				}
			});
			retMe = {type: 'info', value: sValue};
		}
			
		return retMe;

	};
	
	generateToken = function() {
		
		var recToken = record.load({type:'customrecord_netspot', id: 1});
		var objHeader = { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': '*/*'}; 
		var sUrl = 'https://api.hubapi.com/oauth/v1/token';
		var data = 'grant_type=authorization_code&client_id=' + recToken.getValue({fieldId: 'custrecord_ntspt_clientid'}) + '&client_secret='+ recToken.getValue({fieldId: 'custrecord_ntspt_clientsec'}) + 
					'&redirect_uri=https%3A%2F%2F3551004.extforms.netsuite.com%2Fapp%2Fsite%2Fhosting%2Fscriptlet.nl%3Fscript%3D419%26deploy%3D1%26compid%3D3551004%26h%3Dbb3bb1d735c6b9e3e7fe&code=' + recToken.getValue({fieldId: 'custrecord_ntspt_code'});

		var objResp = https.post({url: sUrl, body: data, headers: objHeader});

		if (objResp.code == 200) {
			var objTokens = JSON.parse(objResp.body);
			recToken.setValue({fieldId: 'custrecord_ntspt_refresh_token', value: objTokens.refresh_token});
			recToken.setValue({fieldId: 'custrecord_ntspt_access_token', value: objTokens.access_token});
			recToken.save();
		}
	};
	
	refreshToken = function() {
		
		var recToken = record.load({type:'customrecord_int_config_hubspot', id: 1});
		var objHeader = { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': '*/*'}; 
		var sUrl = 'https://api.hubapi.com/oauth/v1/token';
		var data = 'grant_type=refresh_token&client_id=' + recToken.getValue({fieldId: 'custrecord_nshs_clientid'}) + '&client_secret='+ recToken.getValue({fieldId: 'custrecord_nshs_clientsecret'}) + 
					'&refresh_token=' + recToken.getValue({fieldId: 'custrecord_nshs_refreshtoken'});
		
		var objResp = https.post({url: sUrl, body: data, headers: objHeader});
		
		if (objResp.code == 200) {
			var objTokens = JSON.parse(objResp.body);
			recToken.setValue({fieldId: 'custrecord_nshs_token', value: objTokens.access_token});
			recToken.save();
		}
	};
	
	getAllResults = function(s) {
        var results = s.run();
        var searchResults = [];
        var searchid = 0;
        do {
            var resultslice = results.getRange({start:searchid,end:searchid+1000});
            resultslice.forEach(function(slice) {
                searchResults.push(slice);
                searchid++;
                }
            );
        } while (resultslice.length >=1000);
        return searchResults;
    };
	
	generatePayload = function(option){
		
		var CHARGEBEE_NEW_CONTACT_MAP = 104;
		var CHARGEBEE_EDIT_CONTACT_MAP = 105;
		var ATLASSIAN_NEW_CONTACT_MAP = 107;
		var ATLASSIAN_EDIT_CONTACT_MAP = 106;
		
		var idMap = 0;
		
		var recData = record.load({
		    type: option.record.type,
		    id: option.record.id,
		    isDynamic: true
		});
		
		if(option.type == 'contacts'){
			
			if(option.from == 'chargebee' && option.method == 'create'){
				idMap = CHARGEBEE_NEW_CONTACT_MAP;
			}
			else if(option.from == 'chargebee' && option.method == 'edit'){
				idMap = CHARGEBEE_EDIT_CONTACT_MAP;
			}
			else if(option.from == 'atlassian' && option.method == 'create'){
				idMap = ATLASSIAN_NEW_CONTACT_MAP;
			}
			else if(option.from == 'atlassian' && option.method == 'edit'){
				idMap = ATLASSIAN_EDIT_CONTACT_MAP;
			}
		}
		
        var recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: idMap
        });

        var objMapping = JSON.parse(recMapping.getValue({
            fieldId: 'custrecord_intmap_mapping'
        }));
		
		var objPayload = {};
		
        for (var key in objMapping) {

        	objPayload = nsmapjson.nsMap({
                mapping: objMapping,
                record: recData,
                data: objPayload,
                key: key
            });
        }
        
        return objPayload;
	};

	createRecord = function(option){
		
		var sMessage;
		var sStatus;
		var id;
		
		if(option.version = 3){
			
			try {
				var objPayload = generatePayload(option);
				var resp = https.post({
					url : "https://api.hubapi.com/crm/v3/objects/"
							+ option.type
							+ "?hapikey={custsecret_hubspot_apikey}",
					body : JSON.stringify(objPayload),
					headers : {
						'Content-Type' : 'application/json',
						'Accept' : '*/*'
					},
					credentials : [ 'custsecret_hubspot_apikey' ]
				});
				
				var objBody = {};

				if (resp.code == 201) {

					objBody = JSON.parse(resp.body);
					sMessage = 'Created: ' + (new Date()).toString();
					sStatus = 'SUCCESS';
					id = objBody.id;

				} else {
					objBody = JSON.parse(resp.body);
					sMessage = objBody.message;
					sStatus = 'FAILED';
				}
			} 
			catch (err) {
				sMessage = err;
				sStatus = 'FAILED';
			}
			return {
	            'status' : sStatus,
	            'message': sMessage,
	            'id': id
	        };
			
		}
		
	};
	
	updateRecord = function(option){

		var sMessage;
		var sStatus;
		
		if(option.version = 3){
			
			try {
				
				var objPayload = {
					'inputs' : [ generatePayload(option) ]
				}
				
				var resp = https.post({
					url : "https://api.hubapi.com/crm/v3/objects/"
							+ option.type
							+ "/batch/update?hapikey={custsecret_hubspot_apikey}",
					body : JSON.stringify(objPayload),
					headers : {
						'Content-Type' : 'application/json',
						'Accept' : '*/*'
					},
					credentials : [ 'custsecret_hubspot_apikey' ]
				});

				
				if (resp.code == 200 || resp.code == 201) {

					objBody = JSON.parse(resp.body);
					sMessage = 'Last Updated: ' + (new Date()).toString();
					sStatus = 'SUCCESS';

				} else {
					objBody = JSON.parse(resp.body);
					sMessage = objBody.message;
					sStatus = 'FAILED';
				}
			} 
			catch (err) {
				sMessage = err;
				sStatus = 'FAILED';
			}
			return {
	            'status' : sStatus,
	            'message': sMessage
	        };
		}
	};
	
	associateRecord = function (option){
		
		var resp = https.put({
			url : "https://api.hubapi.com/crm/v3/objects/"
					+ option.type
					+ "/"
					+ option.id
					+ "/associations/"
					+ option.totype
					+ "/"
					+ option.toid
					+ "/"
					+ option.associationtype
					+ "?hapikey={custsecret_hubspot_apikey}",
			headers : {
				'Content-Type' : 'application/json',
				'Accept' : '*/*'
			},
			credentials : [ 'custsecret_hubspot_apikey' ]
		});
		
		var x =1;
	};
	
	createTimelineEvent = function(option){
		return timelineevent.create(option);
	};
	
	createDeal = function(option){
		
		var retMe = deal.create(option);
		
		return retMe;
	};
	
	associateDeal = function(option){
			
			var retMe = deal.associate(option);
			
			return retMe;
	};
	
	updateDeal = function(option){
		
		var retMe = deal.update(option);
		
		return retMe;
	};
	
	getDeal = function(option){
		
		var retMe = deal.get(option);
		
		return retMe;
	};
	
	searchDeal = function(option){
		
		var retMe = deal.search(option);
		return retMe;
		
	};
	
	createCompany = function(option){
		
		var retMe = company.create(option);
		
		return retMe;
	};

	updateCompany = function(option){
		
		var retMe = company.update(option);
		
		return retMe;
	};
	
	getCompany = function(option){
		
		var retMe = company.get(option);
		
		return retMe;
	};
	
	searchCompany = function(option){
		
		var retMe = company.search(option);
		
		return retMe;
	};
	
	updateOpportunity = function(option){
		
		var retMe = opportunity.update(option);
		
		return retMe;
	};
	
    return {
    	sendHubRequest: sendHubRequest,
    	getHubRequest: getHubRequest,
    	generateHubCard: generateHubCard,
    	generateToken: generateToken,
    	refreshToken: refreshToken,
    	createRecord: createRecord,
    	updateRecord: updateRecord,
    	associateRecord: associateRecord,
    	createTimelineEvent: createTimelineEvent,
    	createDeal: createDeal,
    	associateDeal: associateDeal,
    	getDeal: getDeal,
    	updateDeal: updateDeal,
    	searchDeal: searchDeal,
		createCompany: createCompany,
		getCompany: getCompany,
    	updateCompany: updateCompany,
    	searchCompany: searchCompany,
    	updateOpportunity: updateOpportunity
    };
    
});

