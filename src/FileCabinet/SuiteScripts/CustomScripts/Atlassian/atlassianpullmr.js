/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/https', 'N/encode', 'N/record', 'N/format', 'N/search', 'N/runtime', 'N/error', '../Library/momentjs/moment'],
/**
 * @param {https} https
 * @param {encode} encode
 * @param {record} record
 */
function(https, encode, record, format, search, runtime, error, moment) {
   
    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
	var sNextLink = '';
	var sLastLink = '';
	var ATLASSIANTYPE = 1;
	
	var fldValues = [
	                'externalid',
	                'name',
	                'custrecord_transaction_id',
	                'custrecord_addon_license_id',
	                'custrecord_license_id',
	                'custrecord_addon_key',
	                'custrecord_addon_name',
	                'custrecord_host_license_id',
	                'custrecord_company',
	                'custrecord_country',
	                'custrecord_customer_domain',
	                'custrecord_customer',
	                'custrecord_region',
	                'custrecord_technical_contact_name',
	                'custrecord_technical_contact_email',
	                'custrecord_billing_contact_email',
	                'custrecord_billing_contact_name',
	                'custrecord_tier',
	                'custrecord_license_type',
	                'custrecord_hosting',
	                'custrecord_billing_period',
	                'custrecord_sale_type',
	                'custrecord_purchase_price',
	                'custrecord_partner_discount_amount',
	                'custrecord_atlassian_fee',
	                'custrecord_vendor_amount',
	                'custrecord_partner_name',
	                'custrecord_partner_domain',
	                'custrecord_partner_billling_contact_name',
	                'custrecord_partner_type',
	                'custrecord_partner_billing_contact',
	                'custrecord_partner_billing_contact_email',
	                'custrecord_raw_json',
	                'custrecord_vendor_id',
	                'custrecord_user_count'];
	var fldDate = ['custrecord_last_updated',
	               'custrecord_sale_date',
	               'custrecord_maintenance_start_date',
	               'custrecord_maintenance_end_date'];
	
	var fldTxt = ['custrecord_mtx_license_type',
	               'custrecord_mtx_sale_type',
	               'custrecord_mtx_hosting'];
	
	
    function getInputData() {
    	
    	var idInteg = runtime.getCurrentScript().getParameter({name: 'custscript_atlassian_integration'});
    	var idDeploy = runtime.getCurrentScript().getParameter({name: 'custscript_atlassian_deploy_internalid'});
    	var dLastUpdate = runtime.getCurrentScript().getParameter({name: 'custscript_atlassian_lastupdate'});
    	var sOffset = runtime.getCurrentScript().getParameter({name: 'custscript_atlassian_offset'});
    	var recInteg = record.load({type: 'customrecord_int_config_atlassian_market', id: idInteg});
    	var dStart = recInteg.getValue({fieldId: 'custrecord_int_atl_startdate'});
    	var dEnd = recInteg.getValue({fieldId: 'custrecord_int_atl_enddate'});
    	var nLast = recInteg.getValue({fieldId: 'custrecord_int_atl_numdays'});
    	var isManual = runtime.getCurrentScript().getParameter({name: 'custscript_atlassian_manualexec'});
    	
    	var objInputs = [];
    	var dYesterday = new Date();
    		dYesterday.setDate(dYesterday.getDate() - nLast);
    	var sLastUpdate = '';
    	
    	var momDate = moment(new Date);
    	var sYesterday = momDate.subtract(nLast, 'days').format('YYYY-MM-DD');
    	var sLastUpdate = moment(dLastUpdate).format('YYYY-MM-DD');


    	
    	if(isManual){
    		sOffset = '0';
    		sLastUpdate = moment(dLastUpdate, 'DD-MMM-YYYY').format('YYYY-MM-DD');
    	}
    	else{
        	if(sYesterday != sLastUpdate){
        		sLastUpdate = sYesterday;
        		sOffset = '0';
        	}
        	else{
        		sLastUpdate = sLastUpdate;
        	}
    	}

    	var sStart = 'startDate=' + moment(dStart).format('YYYY-MM-DD') +'&';
    	var sEnd = 'endDate=' + moment(dEnd).format('YYYY-MM-DD')  +'&';
    	var sLastUpdate = 'lastUpdated=' + sLastUpdate +'&';
    	var sDateFilters = sStart + sEnd + sLastUpdate;
    	
    	//log.audit({ title: 'getInputData', details: 'sDateFilters: ' + sDateFilters});
    	
    	sNextLink = recInteg.getValue({fieldId: 'custrecord_int_atl_host'}) + '/rest/2/vendors/'+ recInteg.getValue({fieldId: 'custrecord_int_atl_vendorid'}) +'/reporting/sales/transactions?' + sDateFilters + 'offset='+ sOffset +'&limit=50';
    	//sNextLink = 'https://marketplace.atlassian.com/rest/2/vendors/96/reporting/sales/transactions?startDate=2020-06-01&endDate=2020-06-30&lastUpdated=2020-07-3&offset=0&limit=5';
    	
    	//var sBasic = 'Basic ' +  encode.convert({string: recInteg.getValue({fieldId: 'custrecord_int_atl_user'}) + ':' + recInteg.getValue({fieldId: 'custrecord_int_atl_password'}), inputEncoding: encode.Encoding.UTF_8, outputEncoding: encode.Encoding.BASE_64});
    	//var headerObj = {'Content-Type' : 'application/json', 'Authorization' : sBasic};
    	
    	while(sNextLink !=''){
    		
        	//var response = https.get({url: sNextLink, headers: headerObj });
        	
            var response = https.get({
                url: sNextLink,
                headers: {
                	'Content-Type' : 'application/json',
                	'Accept' : '*/*',
                    'Authorization': 'Basic {custsecret_atlassian_apikey}'
                },
                credentials: ["custsecret_atlassian_apikey"]
            });
        	
        	log.audit({ title: 'getInputData', details: 'link: ' + sNextLink});
        	
        	if(response.code == 200){
        		
        		sNextLink = '';
        		var objBody = JSON.parse(response.body);
        		var nOffset = 0;
        		
            	if(objBody.transactions){
            		
            		var arrTransactions = objBody.transactions;
            		var objLinks = objBody._links;
            		
            		arrTransactions.forEach(
            				
            				function(transaction, indx){

            					//if((transaction.purchaseDetails.saleType).toUpperCase() != "REFUND"){
            						
                					var objTrans = {};
                					//objTrans.key = (transaction.transactionId).replace('AT-', '');
                					objTrans.key = transaction.transactionId + '-' + transaction.addonLicenseId;
                					objTrans.name = transaction.transactionId + '-' + transaction.addonLicenseId;
                					objTrans.externalid = transaction.transactionId + '-' + transaction.addonLicenseId;
                					objTrans.custrecord_transaction_id = transaction.transactionId;
            			            objTrans.custrecord_addon_license_id = transaction.addonLicenseId;
            			            objTrans.custrecord_host_license_id =  transaction.hostLicenseId;
            			            objTrans.custrecord_license_id = transaction.licenseId;
            			            objTrans.custrecord_addon_key =  transaction.addonKey;
            			            objTrans.custrecord_addon_name =  transaction.addonName;
            			            objTrans.custrecord_last_updated  = transaction.lastUpdated;
            			            objTrans.custrecord_vendor_id  = recInteg.getValue({fieldId: 'custrecord_int_atl_vendorid'});
            			            
            			            
            			            if(transaction.customerDetails){
            			            	
                			            objTrans.custrecord_company = transaction.customerDetails.company;
                			            objTrans.custrecord_country = transaction.customerDetails.country;
                			            objTrans.custrecord_region = transaction.customerDetails.region;
            			            }
            			            
            			            if(transaction.customerDetails.technicalContact){
                			            objTrans.custrecord_technical_contact_email = transaction.customerDetails.technicalContact.email;
                			            objTrans.custrecord_technical_contact_name = transaction.customerDetails.technicalContact.name;
                			            objTrans.custrecord_customer_domain =  (objTrans.custrecord_technical_contact_email).split('@')[1];
            			            }

            			            if(transaction.customerDetails.billingContact){
                			            objTrans.custrecord_billing_contact_email = transaction.customerDetails.billingContact.email;
                			            objTrans.custrecord_billing_contact_name = transaction.customerDetails.billingContact.name;    			            	
            			            }
            			            
            			            if(transaction.purchaseDetails){
                			            objTrans.custrecord_sale_date = transaction.purchaseDetails.saleDate;
                			            objTrans.custrecord_tier = transaction.purchaseDetails.tier;
                			            
                			            if(transaction.purchaseDetails.tier.toUpperCase() == 'UNLIMITED'){
                			            	objTrans.custrecord_user_count = 987654321;
                			            }
                			            else{
                			            	
                			            	var nNumber = transaction.purchaseDetails.tier.match(/\d+/g);
                    			            if(nNumber != null){
                    			            	objTrans.custrecord_user_count = nNumber[0];	
                    			            }
                			            }

                			            objTrans.custrecord_license_type = transaction.purchaseDetails.licenseType;
                			            objTrans.custrecord_hosting = transaction.purchaseDetails.hosting;
                			            objTrans.custrecord_billing_period = transaction.purchaseDetails.billingPeriod;
                			            objTrans.custrecord_purchase_price = transaction.purchaseDetails.purchasePrice;
                			            objTrans.custrecord_vendor_amount = transaction.purchaseDetails.vendorAmount;
                			            objTrans.custrecord_sale_type = transaction.purchaseDetails.saleType;
                			            objTrans.custrecord_maintenance_start_date = transaction.purchaseDetails.maintenanceStartDate;
                			            objTrans.custrecord_maintenance_end_date = transaction.purchaseDetails.maintenanceEndDate;
                			            objTrans.custrecord_partner_discount_amount = transaction.purchaseDetails.partnerDiscountAmount;
                			            objTrans.custrecord_atlassian_fee = parseFloat(objTrans.custrecord_purchase_price) -  parseFloat(objTrans.custrecord_vendor_amount) - parseFloat(objTrans.custrecord_partner_discount_amount);

                			            objTrans.custrecord_mtx_license_type = transaction.purchaseDetails.licenseType.toUpperCase();
                			            objTrans.custrecord_mtx_sale_type = transaction.purchaseDetails.saleType.toUpperCase();
                			            objTrans.custrecord_mtx_hosting = transaction.purchaseDetails.hosting.toUpperCase();
                			            objTrans.custrecord_mtx_billing_period = transaction.purchaseDetails.billingPeriod.toUpperCase();
            			            }

            			            if(transaction.partnerDetails){
                			            objTrans.custrecord_partner_name = transaction.partnerDetails.partnerName;
                			            objTrans.custrecord_partner_type = transaction.partnerDetails.partnerType;
                			            
                			          
                			            if(transaction.partnerDetails.billingContact){
                    			            objTrans.custrecord_partner_billing_contact_email = transaction.partnerDetails.billingContact.email;
                    			            objTrans.custrecord_partner_billing_contact_name = transaction.partnerDetails.billingContact.name;
                    			            objTrans.custrecord_partner_domain = (objTrans.custrecord_partner_billing_contact_email).split('@')[1];
                			            }
            			            }
            			            
            			            objTrans.custrecord_raw_json = JSON.stringify(transaction);
            			            objInputs.push(objTrans);    						
            					//}

        			            
            			        return true;
            			  	});
            		//sNextLink = '';
            		if(objLinks.next){
            			
            			var sLink = objLinks.next.href.split('offset=')[1];
            			var sOffset = sLink.split('&')[0];
            			nOffset = parseInt(sOffset) + arrTransactions.length;
            			//sNextLink = recInteg.getValue({fieldId: 'custrecord_int_atl_host'}) + (objLinks.next.href).replace('offset=' + sOffset, 'offset=' + nOffset);	
            			//log.audit({ title: 'getInputData', details: 'nOffset: ' + nOffset});
            			sNextLink =  recInteg.getValue({fieldId: 'custrecord_int_atl_host'}) + objLinks.next.href;
            			sLastLink = sNextLink;
            		}
            		else{
            			
            			sNextLink = '';
            			var sOffset;
            			
            			if(sLastLink != '' && sLastLink !=null){
            				var sLink = sLastLink.split('offset=')[1];
                			sOffset = sLink.split('&')[0];	
            			}
            			
            			nOffset = parseInt(sOffset) + arrTransactions.length;
            			//log.audit({ title: 'getInputData', details: 'nOffset: ' + nOffset});
            			//log.audit({ title: 'getInputData', details: 'sLastLink: ' + sLastLink});
            			
            			var recDeploy = record.load({type: 'scriptdeployment', id: idDeploy});
	            			recDeploy.setValue({fieldId: 'custscript_atlassian_offset', value: nOffset});
	            			recDeploy.setValue({fieldId: 'custscript_atlassian_lastupdate', value: dYesterday});
            			var id = recDeploy.save();
            			
            		}
            	}
        	}
        	else{
                var errAtlassian = error.create({
                    name: 'SERVER_ERROR',
                    message: response.code +': ' + response.body,
                    notifyOff: false
                });

                throw errAtlassian;
        	}
    	}

    	return objInputs;
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	
    	var objContext = JSON.parse(context.value); 
    	var keyMap = objContext.key;

    	var objContent = {};
    		objContent.value = [];
    		objContent.text = [];
    		objContent.date = [];

    	fldValues.forEach(function(field, indx) {
    		objContent.value.push({fieldId: field, value: objContext[field]});
		});

    	fldDate.forEach(function(field, indx) {
    		
    		var arrDate  = objContext[field].split('-');
    			sDate = arrDate[1] + '/' + arrDate[2] + '/' + arrDate[0];
    		objContent.date.push({fieldId: field, value: sDate});
		});
    	
    	fldTxt.forEach(function(field, indx) {
    		objContent.text.push({fieldId: field, text: objContext[field]});
		});

        context.write({
            key: keyMap,
            value: objContent
        });
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    reduce = function (context) {

		var id = context.key;
		var objValue = JSON.parse(context.values[0]).value;
		var objText = JSON.parse(context.values[0]).text;
		var objDate = JSON.parse(context.values[0]).date;
		var rec;
		
		var src = search.create({type: 'customrecord_atl_marketplace_transaction', columns: ['internalid'], filters: ['externalid', 'anyof', objValue[0].value]});
		
		var res = src.run().getRange({start: 0, end: 1});
		
		if(res.length > 0){
			rec = record.load({type: 'customrecord_atl_marketplace_transaction', id: res[0].id});
		}
		else{
			rec = record.create({type: 'customrecord_atl_marketplace_transaction'});	
		}
		
		rec.setValue({fieldId: 'custrecord_mp_type', value: ATLASSIANTYPE});
		
    	objValue.forEach(function(field, indx) {
    		rec.setValue(field);
		});
    	
    	objText.forEach(function(field, indx) {
    		rec.setText(field);
		});
    	
    	objDate.forEach(function(field, indx) {
   			field.value = format.parse({ value:new Date(field.value), type: format.Type.DATE});
    		rec.setValue(field);
		});
    	
    	var id = rec.save();
    	
    	/////Linking Starts Here
    	    	
    	//log.audit({ title: 'reduce', details: 'Atlassian Transaction Saved: ' + id});
    	
    	rec = record.load({type: 'customrecord_atl_marketplace_transaction', id: id});
    	
    	//log.audit({ title: 'reduce', details: 'Searching Customer: ' + rec.getValue({fieldId: 'custrecord_company'}) + ':' + rec.getValue({fieldId: 'custrecord_customer_domain'})});
    	
    	var src = search.create({type: 'customer', columns: ['internalid', 'isinactive']});
	    	src.filters = [];
	    	src.filters.push(search.createFilter({name: 'companyname', operator: 'is', values: rec.getValue({fieldId: 'custrecord_company'}).substring(0, 83)}));
	    	//src.filters.push(search.createFilter({name: 'custentity_domain', operator: 'is', values: rec.getValue({fieldId: 'custrecord_customer_domain'})}));
    	
    	var res = src.run().getRange({start: 0, end: 1});
    	
    	//customer
    	var idCustomer;
    	
		if(res.length > 0){
			
			//log.audit({ title: 'reduce', details: 'Customer: found'});
			
			if( res[0].getValue({name: 'isinactive'}) == true ){
				record.submitFields({ type: 'customer', id: res[0].id, values: {isinactive: false}});
			}
			
			rec.setValue({fieldId: 'custrecord_customer', value: res[0].id});
			idCustomer = res[0].id;
		}
		else{
			
			//log.audit({ title: 'reduce', details: 'Customer: not found'});
			//log.audit({ title: 'reduce', details: 'Customer: Creating New customer'});
			
			var recCustomer = record.create({type: 'customer'});
				recCustomer.setValue({fieldId: 'subsidiary', value : 1});
				
				if(rec.getValue({fieldId: 'custrecord_company'}).length > 83){
					recCustomer.setValue({fieldId: 'companyname', value : rec.getValue({fieldId: 'custrecord_company'}).substring(0, 83)});
					recCustomer.setValue({fieldId: 'comments', value : 'Full Company Name: ' + rec.getValue({fieldId: 'custrecord_company'})});
				}
				else{
					recCustomer.setValue({fieldId: 'companyname', value : rec.getValue({fieldId: 'custrecord_company'})});	
				}
				
				recCustomer.setValue({fieldId: 'custentity_domain', value : rec.getValue({fieldId: 'custrecord_customer_domain'})});
				idCustomer = recCustomer.save();
			//log.audit({ title: 'reduce', details: 'Customer: New customer created ' + idCustomer});
				
			rec.setValue({fieldId: 'custrecord_customer', value: idCustomer});
		}
		
		var id = rec.save();
			rec = record.load({type: 'customrecord_atl_marketplace_transaction', id: id});
		
    	//tech contact
		if(rec.getValue({fieldId: 'custrecord_technical_contact_email'}) != '' && rec.getValue({fieldId: 'custrecord_technical_contact_email'}) != null){
			
			//log.audit({ title: 'reduce', details: 'Searching: Tech Contact Email ' + rec.getValue({fieldId: 'custrecord_technical_contact_email'})});
			
	    	var src = search.create({type: 'customer', columns: ['internalid']});
		    	src.filters = [];
		    	src.filters.push(search.createFilter({name: 'email', operator: 'is', values: rec.getValue({fieldId: 'custrecord_technical_contact_email'})}));
	    		
		    var res = src.run().getRange({start: 0, end: 1});
		    
			if(res.length > 0){
				//log.audit({ title: 'reduce', details: 'Searching: Tech Email Found'});
				rec.setValue({fieldId: 'custrecord_technical_contact', value: res[0].id});
				idContact = res[0].id;
			}
			else{
				
				//log.audit({ title: 'reduce', details: 'Searching: Tech Email Not Found'});
				//log.audit({ title: 'reduce', details: 'Searching: Tech Contact Name'});
				
				if(rec.getValue({fieldId: 'custrecord_technical_contact_name'}) != '' && rec.getValue({fieldId: 'custrecord_technical_contact_name'}) != null){
					
			    	var src = search.create({type: 'contact', columns: ['internalid']});
				    	src.filters = [];
				    	src.filters.push(search.createFilter({name: 'entityid', operator: 'is', values: rec.getValue({fieldId: 'custrecord_technical_contact_name'})}));
				    	src.filters.push(search.createFilter({name: 'company', operator: 'anyof', values: idCustomer}));
			    		
				    var res = src.run().getRange({start: 0, end: 1});
				    var idContact;
					
					if(res.length > 0){
						
						//log.audit({ title: 'reduce', details: 'Searching: Tech Contact Name Found'});
						rec.setValue({fieldId: 'custrecord_technical_contact', value: res[0].id});
						idContact = res[0].id;
					}
					else{
						
						//log.audit({ title: 'reduce', details: 'Searching: Tech Contact Name Not Found'});
						//log.audit({ title: 'reduce', details: 'Creating: Creating new Tech Contact'});
						
						var recContact = record.create({type: 'contact'});
							recContact.setValue({fieldId: 'subsidiary', value : 1});
							recContact.setValue({fieldId: 'company', value : idCustomer});
							recContact.setValue({fieldId: 'entityid', value : rec.getValue({fieldId: 'custrecord_technical_contact_name'})});
							recContact.setValue({fieldId: 'email', value : rec.getValue({fieldId: 'custrecord_technical_contact_email'})});
							idContact = recContact.save();
						
						rec.setValue({fieldId: 'custrecord_technical_contact', value: idContact});
					}
				}
				else{
					
			    	var src = search.create({type: 'contact', columns: ['internalid']});
				    	src.filters = [];
				    	src.filters.push(search.createFilter({name: 'entityid', operator: 'is', values: rec.getValue({fieldId: 'custrecord_company'}) + ' Tech Contact'}));
				    	src.filters.push(search.createFilter({name: 'company', operator: 'anyof', values: idCustomer}));
			    		
				    var res = src.run().getRange({start: 0, end: 1});
				    var idContact;
					
					if(res.length > 0){
						
						//log.audit({ title: 'reduce', details: 'Searching: Tech Contact Name Found'});
						rec.setValue({fieldId: 'custrecord_technical_contact', value: res[0].id});
						idContact = res[0].id;
					}
					else{
						
						//log.audit({ title: 'reduce', details: 'Creating: Creating new Tech Contact'});
						
						var recContact = record.create({type: 'contact'});
							recContact.setValue({fieldId: 'subsidiary', value : 1});
							recContact.setValue({fieldId: 'company', value : idCustomer});
							recContact.setValue({fieldId: 'entityid', value : rec.getValue({fieldId: 'custrecord_company'}) + ' Tech Contact'});
							recContact.setValue({fieldId: 'email', value : rec.getValue({fieldId: 'custrecord_technical_contact_email'})});
							idContact = recContact.save();
						
						rec.setValue({fieldId: 'custrecord_technical_contact', value: idContact});
					}
				}
			}
			
			//billing contact if the same as tech
			if(rec.getValue({fieldId: 'custrecord_technical_contact_email'}) == rec.getValue({fieldId: 'custrecord_billing_contact_email'})){
				
				//log.audit({ title: 'reduce', details: 'Checking: Tech Contact same as Bill Contact'});
				rec.setValue({fieldId: 'custrecord_billing_contact', value: idContact});
			}
		}
		
		var id = rec.save();
			rec = record.load({type: 'customrecord_atl_marketplace_transaction', id: id});
		
		//billing contact if not the same as tech
		if(rec.getValue({fieldId: 'custrecord_billing_contact_email'}) && rec.getValue({fieldId: 'custrecord_billing_contact_email'}) != rec.getValue({fieldId: 'custrecord_technical_contact_email'})){
			
			//log.audit({ title: 'reduce', details: 'Searching: Bill Contact Email ' + rec.getValue({fieldId: 'custrecord_billing_contact_email'})});
			
			
	    	var src = search.create({type: 'customer', columns: ['internalid']});
		    	src.filters = [];
		    	src.filters.push(search.createFilter({name: 'email', operator: 'is', values: rec.getValue({fieldId: 'custrecord_billing_contact_email'})}));
	    		
		    var res = src.run().getRange({start: 0, end: 1});
		    var idContact;
		    
			if(res.length > 0){
				rec.setValue({fieldId: 'custrecord_billing_contact', value: res[0].id});
				//log.audit({ title: 'reduce', details: 'Searching: Bill Email Found'});
				idContact = res[0].id;
			}
			else{

				//log.audit({ title: 'reduce', details: 'Searching: Bill Contact Name'});
				
				if(rec.getValue({fieldId: 'custrecord_billing_contact_name'}) != '' && rec.getValue({fieldId: 'custrecord_billing_contact_name'}) != null){
					
			    	var src = search.create({type: 'contact', columns: ['internalid']});
				    	src.filters = [];
				    	src.filters.push(search.createFilter({name: 'entityid', operator: 'is', values: rec.getValue({fieldId: 'custrecord_billing_contact_name'})}));
				    	src.filters.push(search.createFilter({name: 'company', operator: 'anyof', values: idCustomer}));
			    		
				    var res = src.run().getRange({start: 0, end: 1});
				    var idContact;
					
				    if(res.length > 0){
				    	//log.audit({ title: 'reduce', details: 'Searching: Bill Contact Name Found'});
						rec.setValue({fieldId: 'custrecord_billing_contact', value: res[0].id});
						idContact = res[0].id;
					}
				    else{
				    	
				    	//log.audit({ title: 'reduce', details: 'Creating: Creating new Bill Contact'});
	  	
						var recContact = record.create({type: 'contact'});
							recContact.setValue({fieldId: 'subsidiary', value : 1});
							recContact.setValue({fieldId: 'company', value : idCustomer});
							recContact.setValue({fieldId: 'entityid', value : rec.getValue({fieldId: 'custrecord_billing_contact_name'})});
							recContact.setValue({fieldId: 'email', value : rec.getValue({fieldId: 'custrecord_billing_contact_email'})});
							idContact = recContact.save();
						
						rec.setValue({fieldId: 'custrecord_billing_contact', value: idContact});
				    }
				}
				else{
					
			    	var src = search.create({type: 'contact', columns: ['internalid']});
				    	src.filters = [];
				    	src.filters.push(search.createFilter({name: 'entityid', operator: 'is', values: rec.getValue({fieldId: 'custrecord_company'}) + ' Billing Contact'}));
				    	src.filters.push(search.createFilter({name: 'company', operator: 'anyof', values: idCustomer}));
			    		
				    var res = src.run().getRange({start: 0, end: 1});
				    var idContact;
					
				    if(res.length > 0){
				    	//log.audit({ title: 'reduce', details: 'Searching: Bill Contact Name Found'});
						rec.setValue({fieldId: 'custrecord_billing_contact', value: res[0].id});
						idContact = res[0].id;
					}
				    else{
				    	
				    	//log.audit({ title: 'reduce', details: 'Creating: Creating new Bill Contact'});
	  	
						var recContact = record.create({type: 'contact'});
							recContact.setValue({fieldId: 'subsidiary', value : 1});
							recContact.setValue({fieldId: 'company', value : idCustomer});
							recContact.setValue({fieldId: 'entityid', value : rec.getValue({fieldId: 'custrecord_company'}) + ' Billing Contact'});
							recContact.setValue({fieldId: 'email', value : rec.getValue({fieldId: 'custrecord_billing_contact_email'})});
							idContact = recContact.save();
						
						rec.setValue({fieldId: 'custrecord_billing_contact', value: idContact});
				    }
				}
			}
		}

		var id = rec.save();
		rec = record.load({type: 'customrecord_atl_marketplace_transaction', id: id});
		
		//log.audit({ title: 'reduce', details: 'Searching Partner: ' + rec.getValue({fieldId: 'custrecord_partner_name'})});
		
		//partner
		if(rec.getValue({fieldId: 'custrecord_partner_name'}) != '' && rec.getValue({fieldId: 'custrecord_partner_name'}) != null){
			
	    	var src = search.create({type: 'partner', columns: ['internalid']});
		    	src.filters = [];
		    	src.filters.push(search.createFilter({name: 'entityid', operator: 'is', values: rec.getValue({fieldId: 'custrecord_partner_name'})}));
			
			var res = src.run().getRange({start: 0, end: 1});
			
			var idPartner;
			
			if(res.length > 0){
				rec.setValue({fieldId: 'custrecord_partner', value: res[0].id});
				idPartner =  res[0].id;
			}
			else{
				var recPartner = record.create({type: 'partner'});
					recPartner.setValue({fieldId: 'subsidiary', value : 1});
					recPartner.setValue({fieldId: 'companyname', value : rec.getValue({fieldId: 'custrecord_partner_name'})});
					recPartner.setValue({fieldId: 'custentity_domain', value : rec.getValue({fieldId: 'custrecord_partner_domain'})});
					idPartner = recPartner.save();
				
				rec.setValue({fieldId: 'custrecord_partner', value: idPartner});
			}
		
			
			if(rec.getValue({fieldId: 'custrecord_partner_billing_contact_email'})){
				
		    	var src = search.create({type: 'contact', columns: ['internalid']});
			    	src.filters = [];
			    	src.filters.push(search.createFilter({name: 'email', operator: 'is', values: rec.getValue({fieldId: 'custrecord_partner_billing_contact_email'})}));
		    		
			    var res = src.run().getRange({start: 0, end: 1});
			    
				if(res.length > 0){
					rec.setValue({fieldId: 'custrecord_partner_billing_contact', value: res[0].id});
					idContact = res[0].id;
				}
				else{
					
					var src = search.create({type: 'contact', columns: ['internalid']});
					
					if(rec.getValue({fieldId: 'custrecord_partner_billling_contact_name'}) != '' && rec.getValue({fieldId: 'custrecord_partner_billling_contact_name'}) != null){
						
				    	src.filters = [];
				    	src.filters.push(search.createFilter({name: 'entityid', operator: 'is', values: rec.getValue({fieldId: 'custrecord_partner_billling_contact_name'})}));
				    	src.filters.push(search.createFilter({name: 'company', operator: 'anyof', values: idPartner}));
				    	
				    	
					    var res = src.run().getRange({start: 0, end: 1});
					    var idContact;
						
					    if(res.length > 0){
							rec.setValue({fieldId: 'custrecord_partner_billing_contact', value: res[0].id});
							idContact = res[0].id;
						}
					    else{
							
							var recContact = record.create({type: 'contact'});
								recContact.setValue({fieldId: 'subsidiary', value : 1});
								recContact.setValue({fieldId: 'company', value : idPartner});
								recContact.setValue({fieldId: 'entityid', value : rec.getValue({fieldId: 'custrecord_partner_billling_contact_name'})});
								recContact.setValue({fieldId: 'email', value : rec.getValue({fieldId: 'custrecord_partner_billing_contact_email'})});
								idContact = recContact.save();
							
							rec.setValue({fieldId: 'custrecord_partner_billing_contact', value: idContact});
					    }
					    
					}
					else{
						
				    	src.filters = [];
				    	src.filters.push(search.createFilter({name: 'entityid', operator: 'is', values: rec.getValue({fieldId: 'custrecord_partner_name'}) + ' Contact'}));
				    	src.filters.push(search.createFilter({name: 'company', operator: 'anyof', values: idPartner}));
				    	
				    	
					    var res = src.run().getRange({start: 0, end: 1});
					    var idContact;
						
					    if(res.length > 0){
							rec.setValue({fieldId: 'custrecord_partner_billing_contact', value: res[0].id});
							idContact = res[0].id;
						}
					    else{
							
							var recContact = record.create({type: 'contact'});
								recContact.setValue({fieldId: 'subsidiary', value : 1});
								recContact.setValue({fieldId: 'company', value : idPartner});
								recContact.setValue({fieldId: 'entityid', value : rec.getValue({fieldId: 'custrecord_partner_name'}) + ' Contact'});
								recContact.setValue({fieldId: 'email', value : rec.getValue({fieldId: 'custrecord_partner_billing_contact_email'})});
								idContact = recContact.save();
							
							rec.setValue({fieldId: 'custrecord_partner_billing_contact', value: idContact});
					    }
					}
				}
			}			
		}
		
		var id = rec.save();
		rec = record.load({type: 'customrecord_atl_marketplace_transaction', id: id});
		
		//checking of matrix key
		var src = search.create({type: 'item', columns: ['internalid']});
    		src.filters = [];
    		src.filters.push(search.createFilter({name: 'custitem_addon_key', operator: 'is', values: rec.getValue({fieldId: 'custrecord_addon_key'})}));
    		src.filters.push(search.createFilter({name: 'custitem_matrix_license_type', operator: 'is', values: rec.getValue({fieldId: 'custrecord_mtx_license_type'})}));
    		src.filters.push(search.createFilter({name: 'custitem_matrix_sale_type', operator: 'is', values: rec.getValue({fieldId: 'custrecord_mtx_sale_type'})}));
    		src.filters.push(search.createFilter({name: 'custitem_matrix_hosting', operator: 'is', values: rec.getValue({fieldId: 'custrecord_mtx_hosting'})}));
			src.filters.push(search.createFilter({name: 'matrix', operator: 'is', values: false}));
      
    	var res = src.run().getRange({start: 0, end: 1});
    	
    	if(res.length > 0){
    		rec.setValue({fieldId: 'custrecord_item', value: res[0].id});
			var id = rec.save();
    	}
    	else{
    		//error for missing addon key
    		
            var errAtlassian = error.create({
                name: 'ITEM_COMBINATION_NOT_FOUND',
                message: rec.getValue({fieldId: 'custrecord_transaction_id'}) + '|' + rec.getValue({fieldId: 'custrecord_license_id'}) +' - Missing Combination for addon key: ' + rec.getValue({fieldId: 'custrecord_addon_key'}) + ' ('+ rec.getText({fieldId: 'custrecord_mtx_license_type'}) + 
                ', ' + rec.getText({fieldId: 'custrecord_mtx_sale_type'}) +', ' + rec.getText({fieldId: 'custrecord_mtx_hosting'}) +', ' + rec.getText({fieldId: 'custrecord_mtx_billing_period'})  +')' ,
                notifyOff: false
            });

            throw errAtlassian;
    	}

    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    summarize = function (summary) {
    	
    	var idDeploy = runtime.getCurrentScript().getParameter({name: 'custscript_atlassian_deploy_internalid'});
        var errorMsg = [];
        var inputSummary = summary.inputSummary;
        var mapSummary = summary.mapSummary;
        var reduceSummary = summary.reduceSummary;
        
        if(summary.inputSummary.error){
            var msg = 'Error was: ' + summary.inputSummary.error + '\n';
            errorMsg.push(msg);
        }
        
        var recDeploy = record.load({type: 'scriptdeployment', id: idDeploy});
        var nOffset = recDeploy.getValue({fieldId: 'custscript_atlassian_offset'});
        
        //log.audit({ title: 'summarize', details: 'offset: ' + nOffset});
        
        var nProcessed = 0;
        var nErrored = 0;
        
        reduceSummary.keys.iterator().each(function (key, executionCount, completionState){
	
	        if (completionState === 'COMPLETE'){
	        	nProcessed++;
	        }
	        else if (completionState === 'FAILED'){
	        	nErrored++;
	        }
	        return true;

        });
        
        reduceSummary.errors.iterator().each(function(key, value){
            var msg = 'Process id: ' + key + '. Error was: ' + JSON.parse(value).message + '\n';
            errorMsg.push(msg);
            return true;
        });
        
        var sMessage = '';
        
        if(errorMsg.length > 0){
	       	 sMessage =  'Error on importing Atlassian Transaction.  Please visit this article in TSM for details (https://rocketeers.atlassian.net/l/c/FhNAcJwj): ' + JSON.stringify(errorMsg);
	       }
	       else{
	       	sMessage = 'Successful';
	       }

        var recLog = record.create({type: 'customrecord_atlassian_summary', isDynamic: true});
	        recLog.setValue({fieldId: 'custrecord_atlassum_message', value: sMessage});
	        recLog.setValue({fieldId: 'custrecord_atlassum_numprocessed', value: parseInt(nProcessed) + parseInt(nErrored)});
	        recLog.setValue({fieldId: 'custrecord_atlassum_error', value: nErrored});
        var id = recLog.save();
    }

    return {

        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});