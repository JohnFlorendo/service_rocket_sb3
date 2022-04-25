/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/https', 'N/encode', 'N/record', 'N/format', 'N/search', 'N/runtime', 'N/error', 'N/task'],
/**
 * @param {https} https
 * @param {encode} encode
 * @param {record} record
 */
function(https, encode, record, format, search, runtime, error, task) {
   
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
	                'custrecord_lic_addon_key',
	                'custrecord_lic_addon_license_id',
	                'custrecord_lic_host_license_id',
	                'custrecord_lic_transaction_id',
	                'custrecord_lic_addon_name',
	                'custrecord_lic_company_name',
	                'custrecord_lic_license_id',
	                'custrecord_lic_country',
	                'custrecord_lic_region',
	                'custrecord_lic_hosting',
	                'custrecord_lic_license_type',
	                'custrecord_lic_status',
	                'custrecord_lic_tier',
	                'custrecord_lic_tech_contact_name',
	                'custrecord_lic_tech_contact_email',
	                'custrecord_lic_tech_contact_address1',
	                'custrecord_lic_tech_contact_address2',
	                'custrecord_lic_tech_contact_city',
	                'custrecord_lic_tech_contact_postcode',
	                'custrecord_lic_billing_contact_email',
	                'custrecord_lic_billing_contact_name',
	                'custrecord_lic_billing_contact_address1',
	                'custrecord_lic_billing_contact_address2',
	                'custrecord_lic_billing_contact_city',
	                'custrecord_lic_billing_contact_postcode',
	                'custrecord_lic_pnr_billing_contact_name',
	                'custrecord_lic_pnr_billing_contact_email',
	                'custrecord_lic_partner_name',
	                'custrecord_lic_partner_type',
	                'custrecord_lic_customer_domain',
	                'custrecord_lic_raw_json',
	                'custrecord_lic_region',
	                'custrecord_lic_vendor_id'];
	var fldDate = ['custrecord_lic_last_updated',
	               'custrecord_lic_maintenance_start_date',
	               'custrecord_lic_maintenance_end_date'];
	
	var fldTxt = [];
	
	
    function getInputData() {

    	var dLastUpdate = runtime.getCurrentScript().getParameter({name: 'custscript_lichist_lastupdate'});
    	var objInputs = [];
    	var sLastUpdate = dLastUpdate.getFullYear() + '-' + (parseInt(dLastUpdate.getMonth()) + 1) + '-' + dLastUpdate.getDate();
    	

		sNextLink ='https://marketplace.atlassian.com/rest/2/vendors/96/reporting/licenses?startDate=2019-8-1&endDate=2019-9-30&offset=0&limit=50&lastUpdated=' + sLastUpdate;
    	//sNextLink ='https://marketplace.atlassian.com/rest/2/vendors/96/reporting/licenses?startDate=2021-4-14&endDate=2021-6-30&offset=0&limit=50';
    	log.audit({ title: 'getInputData', details: 'sNextLink: ' + sNextLink});
    	
    	var sBasic = 'Basic ' +  encode.convert({string: 'engliew@me.com:EhwHv6PUOthU4mh9eFIYC2A3', inputEncoding: encode.Encoding.UTF_8, outputEncoding: encode.Encoding.BASE_64});
    	var headerObj = {'Content-Type' : 'application/json', 'Authorization' : sBasic};
    	
    	while(sNextLink !=''){
    		
        	var response = https.get({url: sNextLink, headers: headerObj });
        	//log.audit({ title: 'getInputData', details: 'link: ' + sNextLink});
        	
        	if(response.code == 200){
        		
        		sNextLink = '';
        		var objBody = JSON.parse(response.body);
        		var nOffset = 0;
        		
            	if(objBody.licenses){
            		
            		var arrLicenses = objBody.licenses;
            		var objLinks = objBody._links;
            		
            		arrLicenses.forEach(
            				
            				function(license, indx){

            					var objTrans = {};
            					//objTrans.key = (license.licenseId).replace('AT-', '');
            					objTrans.key = license.licenseId + '-' + license.maintenanceStartDate;
            					objTrans.name = license.licenseId + '-' + license.maintenanceStartDate;
            					objTrans.externalid = license.licenseId + '-' + license.addonLicenseId;
            					objTrans.custrecord_lic_vendor_id  = '96';
            					
            					objTrans.custrecord_lic_addon_key =  license.addonKey;
            					objTrans.custrecord_lic_addon_license_id = license.addonLicenseId;
            					objTrans.custrecord_lic_host_license_id =  license.hostLicenseId;
            					objTrans.custrecord_lic_transaction_id = license.transactionId;
            					objTrans.custrecord_lic_addon_name =  license.addonName;
            					objTrans.custrecord_lic_last_updated  = license.lastUpdated;
        			            objTrans.custrecord_lic_license_id = license.licenseId;
        			            objTrans.custrecord_lic_hosting = license.hosting;
        			            objTrans.custrecord_lic_license_type = license.licenseType;
        			            objTrans.custrecord_lic_maintenance_start_date = license.maintenanceStartDate;
        			            objTrans.custrecord_lic_maintenance_end_date = license.maintenanceEndDate;
        			            objTrans.custrecord_lic_status = license.status;
        			            objTrans.custrecord_lic_tier = license.tier;
        			            
        			            if(license.contactDetails){
            			            objTrans.custrecord_lic_company_name = license.contactDetails.company;
            			            objTrans.custrecord_lic_country = license.contactDetails.country;
            			            objTrans.custrecord_lic_region = license.contactDetails.region;
        			            }
        			            
        			            if(license.contactDetails.technicalContact){
            			            objTrans.custrecord_lic_tech_contact_email = license.contactDetails.technicalContact.email;
            			            objTrans.custrecord_lic_tech_contact_name = license.contactDetails.technicalContact.name;

            			            objTrans.custrecord_lic_tech_contact_address1 = license.contactDetails.technicalContact.address1;
            			            objTrans.custrecord_lic_tech_contact_address2 = license.contactDetails.technicalContact.address2;
            			            objTrans.custrecord_lic_tech_contact_city = license.contactDetails.technicalContact.city;
            			            objTrans.custrecord_lic_tech_contact_postcode = license.contactDetails.technicalContact.postcode;
        			            }

        			            if(license.contactDetails.billingContact){
            			            objTrans.custrecord_lic_billing_contact_email = license.contactDetails.billingContact.email;
            			            objTrans.custrecord_lic_billing_contact_name = license.contactDetails.billingContact.name;   
            			            objTrans.custrecord_lic_billing_contact_address1 = license.contactDetails.billingContact.address1;
            			            objTrans.custrecord_lic_billing_contact_address2 = license.contactDetails.billingContact.address2;
            			            objTrans.custrecord_lic_billing_contact_city = license.contactDetails.billingContact.city;
            			            objTrans.custrecord_lic_billing_contact_postcode = license.contactDetails.billingContact.postcode;
        			            }
        			            
        			            if(license.partnerDetails){
        			            	
        			            	objTrans.custrecord_lic_partner_type = license.partnerDetails.partnerType;
            			            objTrans.custrecord_lic_partner_name = license.partnerDetails.partnerName;
            			          
            			            if(license.partnerDetails.billingContact){
                			            objTrans.custrecord_lic_pnr_billing_contact_email = license.partnerDetails.billingContact.email;
                			            objTrans.custrecord_lic_pnr_billing_contact_name = license.partnerDetails.billingContact.name;
            			            }
        			            }
        			            
        			            objTrans.custrecord_lic_customer_domain =  (objTrans.custrecord_lic_tech_contact_email).split('@')[1];
        			            
        			            objTrans.custrecord_lic_raw_json = JSON.stringify(license);
        			            objInputs.push(objTrans);
        			            
            			        return true;
            			  	});
            		
            		//sNextLink = '';
            		if(objLinks.next){
            			
            			var sLink = objLinks.next.href.split('offset=')[1];
            			var sOffset = sLink.split('&')[0];
            			nOffset = parseInt(sOffset) + arrLicenses.length;
            			sNextLink =  'https://marketplace.atlassian.com' + objLinks.next.href;
            			sLastLink = sNextLink;
            		}
            		else{
            			
            			var dNewLastUpdate = new Date (dLastUpdate.setDate(dLastUpdate.getDate() + 1));
            			

            				
            				log.audit({ title: 'getInputData', details: 'dNewLastUpdate: ' + dNewLastUpdate});
                			var recDeploy = record.load({type: 'scriptdeployment', id: 15484});
    	            			recDeploy.setValue({fieldId: 'custscript_lichist_lastupdate', value: dNewLastUpdate});
                			//var id = recDeploy.save();
                			
                			var recDeploy = record.load({type: 'scriptdeployment', id: 15630});
                				recDeploy.setValue({fieldId: 'custscript_lichist_lastupdate', value: dNewLastUpdate});
                			//var id = recDeploy.save();
                			
                			var recDeploy = record.load({type: 'scriptdeployment', id: 15631});
            					recDeploy.setValue({fieldId: 'custscript_lichist_lastupdate', value: dNewLastUpdate});
            				//var id = recDeploy.save();
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

    	log.audit({ title: 'getInputData', details: 'objInputs: ' + JSON.stringify(objInputs)});
    	log.audit({ title: 'getInputData', details: 'objInputs Count: ' + objInputs.length});
    	
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
		
		var src = search.create({type: 'customrecord_atl_marketplace_license', columns: ['internalid'], filters: ['externalid', 'anyof', objValue[0].value]});
		
		var res = src.run().getRange({start: 0, end: 1});
		
		if(res.length > 0){
			rec = record.load({type: 'customrecord_atl_marketplace_license', id: res[0].id});
		}
		else{
			rec = record.create({type: 'customrecord_atl_marketplace_license'});	
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
    	
    	rec = record.load({type: 'customrecord_atl_marketplace_license', id: id});
    	
    	//log.audit({ title: 'reduce', details: 'Searching Customer: ' + rec.getValue({fieldId: 'custrecord_company'}) + ':' + rec.getValue({fieldId: 'custrecord_customer_domain'})});
    	
    	var src = search.create({type: 'customer', columns: ['internalid', 'isinactive']});
	    	src.filters = [];
	    	src.filters.push(search.createFilter({name: 'companyname', operator: 'is', values: rec.getValue({fieldId: 'custrecord_lic_company_name'}).substring(0, 83)}));
	    	//src.filters.push(search.createFilter({name: 'custentity_domain', operator: 'is', values: rec.getValue({fieldId: 'custrecord_customer_domain'})}));
    	
    	var res = src.run().getRange({start: 0, end: 1});
    	
    	//customer
    	var idCustomer;
    	
		if(res.length > 0){
			
			//log.audit({ title: 'reduce', details: 'Customer: found'});
			
			if( res[0].getValue({name: 'isinactive'}) == true ){
				record.submitFields({ type: 'customer', id: res[0].id, values: {isinactive: false}});
			}
			
			rec.setValue({fieldId: 'custrecord_lic_company', value: res[0].id});
			idCustomer = res[0].id;
		}
		else{
			
			//log.audit({ title: 'reduce', details: 'Customer: not found'});
			//log.audit({ title: 'reduce', details: 'Customer: Creating New customer'});
			
			var recCustomer = record.create({type: 'customer'});
				recCustomer.setValue({fieldId: 'subsidiary', value : 1});
				
				if(rec.getValue({fieldId: 'custrecord_lic_company_name'}).length > 83){
					recCustomer.setValue({fieldId: 'companyname', value : rec.getValue({fieldId: 'custrecord_lic_company_name'}).substring(0, 83)});
					recCustomer.setValue({fieldId: 'comments', value : 'Full Company Name: ' + rec.getValue({fieldId: 'custrecord_lic_company_name'})});
				}
				else{
					recCustomer.setValue({fieldId: 'companyname', value : rec.getValue({fieldId: 'custrecord_lic_company_name'})});	
				}
				
				recCustomer.setValue({fieldId: 'custentity_domain', value : rec.getValue({fieldId: 'custrecord_lic_customer_domain'})});
				idCustomer = recCustomer.save();
			//log.audit({ title: 'reduce', details: 'Customer: New customer created ' + idCustomer});
				
			rec.setValue({fieldId: 'custrecord_lic_company', value: idCustomer});
		}
		
		var id = rec.save();
			rec = record.load({type: 'customrecord_atl_marketplace_license', id: id});
		
    	//tech contact
		if(rec.getValue({fieldId: 'custrecord_lic_tech_contact_email'}) != '' && rec.getValue({fieldId: 'custrecord_lic_tech_contact_email'}) != null){
			
			//log.audit({ title: 'reduce', details: 'Searching: Tech Contact Email ' + rec.getValue({fieldId: 'custrecord_technical_contact_email'})});
			
	    	var src = search.create({type: 'customer', columns: ['internalid']});
		    	src.filters = [];
		    	src.filters.push(search.createFilter({name: 'email', operator: 'is', values: rec.getValue({fieldId: 'custrecord_lic_tech_contact_email'})}));
	    		
		    var res = src.run().getRange({start: 0, end: 1});
		    
			if(res.length > 0){
				//log.audit({ title: 'reduce', details: 'Searching: Tech Email Found'});
				rec.setValue({fieldId: 'custrecord_lic_tech_contact', value: res[0].id});
				idContact = res[0].id;
			}
			else{
				
				//log.audit({ title: 'reduce', details: 'Searching: Tech Email Not Found'});
				//log.audit({ title: 'reduce', details: 'Searching: Tech Contact Name'});
				
				if(rec.getValue({fieldId: 'custrecord_lic_tech_contact_name'}) != '' && rec.getValue({fieldId: 'custrecord_lic_tech_contact_name'}) != null){
					
			    	var src = search.create({type: 'contact', columns: ['internalid']});
				    	src.filters = [];
				    	src.filters.push(search.createFilter({name: 'entityid', operator: 'is', values: rec.getValue({fieldId: 'custrecord_lic_tech_contact_name'})}));
				    	src.filters.push(search.createFilter({name: 'company', operator: 'anyof', values: idCustomer}));
			    		
				    var res = src.run().getRange({start: 0, end: 1});
				    var idContact;
					
					if(res.length > 0){
						
						//log.audit({ title: 'reduce', details: 'Searching: Tech Contact Name Found'});
						rec.setValue({fieldId: 'custrecord_lic_tech_contact', value: res[0].id});
						idContact = res[0].id;
					}
					else{
						
						//log.audit({ title: 'reduce', details: 'Searching: Tech Contact Name Not Found'});
						//log.audit({ title: 'reduce', details: 'Creating: Creating new Tech Contact'});
						
						var recContact = record.create({type: 'contact'});
							recContact.setValue({fieldId: 'subsidiary', value : 1});
							recContact.setValue({fieldId: 'company', value : idCustomer});
							recContact.setValue({fieldId: 'entityid', value : rec.getValue({fieldId: 'custrecord_lic_tech_contact_name'})});
							recContact.setValue({fieldId: 'email', value : rec.getValue({fieldId: 'custrecord_lic_tech_contact_email'})});
							idContact = recContact.save();
						
						rec.setValue({fieldId: 'custrecord_lic_tech_contact', value: idContact});
					}
				}
				else{
					
			    	var src = search.create({type: 'contact', columns: ['internalid']});
				    	src.filters = [];
				    	src.filters.push(search.createFilter({name: 'entityid', operator: 'is', values: rec.getValue({fieldId: 'custrecord_lic_company_name'}) + ' Tech Contact'}));
				    	src.filters.push(search.createFilter({name: 'company', operator: 'anyof', values: idCustomer}));
			    		
				    var res = src.run().getRange({start: 0, end: 1});
				    var idContact;
					
					if(res.length > 0){
						
						//log.audit({ title: 'reduce', details: 'Searching: Tech Contact Name Found'});
						rec.setValue({fieldId: 'custrecord_lic_tech_contact', value: res[0].id});
						idContact = res[0].id;
					}
					else{
						
						//log.audit({ title: 'reduce', details: 'Creating: Creating new Tech Contact'});
						
						var recContact = record.create({type: 'contact'});
							recContact.setValue({fieldId: 'subsidiary', value : 1});
							recContact.setValue({fieldId: 'company', value : idCustomer});
							recContact.setValue({fieldId: 'entityid', value : rec.getValue({fieldId: 'custrecord_lic_company_name'}) + ' Tech Contact'});
							recContact.setValue({fieldId: 'email', value : rec.getValue({fieldId: 'custrecord_lic_tech_contact_email'})});
							idContact = recContact.save();
						
						rec.setValue({fieldId: 'custrecord_technical_contact', value: idContact});
					}
				}
			}
			
			//billing contact if the same as tech
			if(rec.getValue({fieldId: 'custrecord_lic_tech_contact_email'}) == rec.getValue({fieldId: 'custrecord_lic_billing_contact_email'})){
				
				//log.audit({ title: 'reduce', details: 'Checking: Tech Contact same as Bill Contact'});
				rec.setValue({fieldId: 'custrecord_lic_billing_contact', value: idContact});
			}
		}
		
		var id = rec.save();
			rec = record.load({type: 'customrecord_atl_marketplace_license', id: id});
		
		//billing contact if not the same as tech
		if(rec.getValue({fieldId: 'custrecord_lic_billing_contact_email'}) && rec.getValue({fieldId: 'custrecord_lic_billing_contact_email'}) != rec.getValue({fieldId: 'custrecord_lic_tech_contact_email'})){
			
			//log.audit({ title: 'reduce', details: 'Searching: Bill Contact Email ' + rec.getValue({fieldId: 'custrecord_billing_contact_email'})});
			
			
	    	var src = search.create({type: 'customer', columns: ['internalid']});
		    	src.filters = [];
		    	src.filters.push(search.createFilter({name: 'email', operator: 'is', values: rec.getValue({fieldId: 'custrecord_lic_billing_contact_email'})}));
	    		
		    var res = src.run().getRange({start: 0, end: 1});
		    var idContact;
		    
			if(res.length > 0){
				rec.setValue({fieldId: 'custrecord_lic_billing_contact', value: res[0].id});
				//log.audit({ title: 'reduce', details: 'Searching: Bill Email Found'});
				idContact = res[0].id;
			}
			else{

				//log.audit({ title: 'reduce', details: 'Searching: Bill Contact Name'});
				
				if(rec.getValue({fieldId: 'custrecord_lic_billing_contact_name'}) != '' && rec.getValue({fieldId: 'custrecord_lic_billing_contact_name'}) != null){
					
			    	var src = search.create({type: 'contact', columns: ['internalid']});
				    	src.filters = [];
				    	src.filters.push(search.createFilter({name: 'entityid', operator: 'is', values: rec.getValue({fieldId: 'custrecord_lic_billing_contact_name'})}));
				    	src.filters.push(search.createFilter({name: 'company', operator: 'anyof', values: idCustomer}));
			    		
				    var res = src.run().getRange({start: 0, end: 1});
				    var idContact;
					
				    if(res.length > 0){
				    	//log.audit({ title: 'reduce', details: 'Searching: Bill Contact Name Found'});
						rec.setValue({fieldId: 'custrecord_lic_billing_contact', value: res[0].id});
						idContact = res[0].id;
					}
				    else{
				    	
				    	//log.audit({ title: 'reduce', details: 'Creating: Creating new Bill Contact'});
	  	
						var recContact = record.create({type: 'contact'});
							recContact.setValue({fieldId: 'subsidiary', value : 1});
							recContact.setValue({fieldId: 'company', value : idCustomer});
							recContact.setValue({fieldId: 'entityid', value : rec.getValue({fieldId: 'custrecord_lic_billing_contact_name'})});
							recContact.setValue({fieldId: 'email', value : rec.getValue({fieldId: 'custrecord_lic_billing_contact_email'})});
							idContact = recContact.save();
						
						rec.setValue({fieldId: 'custrecord_lic_billing_contact', value: idContact});
				    }
				}
				else{
					
			    	var src = search.create({type: 'contact', columns: ['internalid']});
				    	src.filters = [];
				    	src.filters.push(search.createFilter({name: 'entityid', operator: 'is', values: rec.getValue({fieldId: 'custrecord_lic_company_name'}) + ' Billing Contact'}));
				    	src.filters.push(search.createFilter({name: 'company', operator: 'anyof', values: idCustomer}));
			    		
				    var res = src.run().getRange({start: 0, end: 1});
				    var idContact;
					
				    if(res.length > 0){
				    	//log.audit({ title: 'reduce', details: 'Searching: Bill Contact Name Found'});
						rec.setValue({fieldId: 'custrecord_lic_billing_contact', value: res[0].id});
						idContact = res[0].id;
					}
				    else{
				    	
				    	//log.audit({ title: 'reduce', details: 'Creating: Creating new Bill Contact'});
	  	
						var recContact = record.create({type: 'contact'});
							recContact.setValue({fieldId: 'subsidiary', value : 1});
							recContact.setValue({fieldId: 'company', value : idCustomer});
							recContact.setValue({fieldId: 'entityid', value : rec.getValue({fieldId: 'custrecord_lic_company_name'}) + ' Billing Contact'});
							recContact.setValue({fieldId: 'email', value : rec.getValue({fieldId: 'custrecord_lic_billing_contact_email'})});
							idContact = recContact.save();
						
						rec.setValue({fieldId: 'custrecord_lic_billing_contact', value: idContact});
				    }
				}
			}
		}

		var id = rec.save();
		rec = record.load({type: 'customrecord_atl_marketplace_license', id: id});
		
		//log.audit({ title: 'reduce', details: 'Searching Partner: ' + rec.getValue({fieldId: 'custrecord_partner_name'})});
		
		//partner
		if(rec.getValue({fieldId: 'custrecord_lic_partner_name'}) != '' && rec.getValue({fieldId: 'custrecord_lic_partner_name'}) != null){
			
	    	var src = search.create({type: 'partner', columns: ['internalid']});
		    	src.filters = [];
		    	src.filters.push(search.createFilter({name: 'entityid', operator: 'is', values: rec.getValue({fieldId: 'custrecord_lic_partner_name'})}));
			
			var res = src.run().getRange({start: 0, end: 1});
			
			var idPartner;
			
			if(res.length > 0){
				rec.setValue({fieldId: 'custrecord_lic_partner', value: res[0].id});
				idPartner =  res[0].id;
			}
			else{
				var recPartner = record.create({type: 'partner'});
					recPartner.setValue({fieldId: 'subsidiary', value : 1});
					recPartner.setValue({fieldId: 'companyname', value : rec.getValue({fieldId: 'custrecord_lic_partner_name'})});
					idPartner = recPartner.save();
				
				rec.setValue({fieldId: 'custrecord_lic_partner', value: idPartner});
			}
		
			
			if(rec.getValue({fieldId: 'custrecord_lic_pnr_billing_contact_email'})){
				
		    	var src = search.create({type: 'contact', columns: ['internalid']});
			    	src.filters = [];
			    	src.filters.push(search.createFilter({name: 'email', operator: 'is', values: rec.getValue({fieldId: 'custrecord_lic_pnr_billing_contact_email'})}));
		    		
			    var res = src.run().getRange({start: 0, end: 1});
			    
				if(res.length > 0){
					rec.setValue({fieldId: 'custrecord_lic_pnr_billing_contact', value: res[0].id});//missing
					idContact = res[0].id;
				}
				else{
					
					var src = search.create({type: 'contact', columns: ['internalid']});
					
					if(rec.getValue({fieldId: 'custrecord_lic_pnr_billing_contact_name'}) != '' && rec.getValue({fieldId: 'custrecord_lic_pnr_billing_contact_name'}) != null){
						
				    	src.filters = [];
				    	src.filters.push(search.createFilter({name: 'entityid', operator: 'is', values: rec.getValue({fieldId: 'custrecord_lic_pnr_billing_contact_name'})}));
				    	src.filters.push(search.createFilter({name: 'company', operator: 'anyof', values: idPartner}));
				    	
				    	
					    var res = src.run().getRange({start: 0, end: 1});
					    var idContact;
						
					    if(res.length > 0){
							rec.setValue({fieldId: 'custrecord_lic_pnr_billing_contact', value: res[0].id});//missing
							idContact = res[0].id;
						}
					    else{
							
							var recContact = record.create({type: 'contact'});
								recContact.setValue({fieldId: 'subsidiary', value : 1});
								recContact.setValue({fieldId: 'company', value : idPartner});
								recContact.setValue({fieldId: 'entityid', value : rec.getValue({fieldId: 'custrecord_lic_pnr_billing_contact_name'})});
								recContact.setValue({fieldId: 'email', value : rec.getValue({fieldId: 'custrecord_lic_pnr_billing_contact_email'})});
								idContact = recContact.save();
							
							rec.setValue({fieldId: 'custrecord_lic_pnr_billing_contact', value: idContact});//missing
					    }
					    
					}
					else{
						
				    	src.filters = [];
				    	src.filters.push(search.createFilter({name: 'entityid', operator: 'is', values: rec.getValue({fieldId: 'custrecord_lic_partner_name'}) + ' Contact'}));
				    	src.filters.push(search.createFilter({name: 'company', operator: 'anyof', values: idPartner}));
				    	
				    	
					    var res = src.run().getRange({start: 0, end: 1});
					    var idContact;
						
					    if(res.length > 0){
							rec.setValue({fieldId: 'custrecord_lic_pnr_billing_contact', value: res[0].id});//missing
							idContact = res[0].id;
						}
					    else{
							
							var recContact = record.create({type: 'contact'});
								recContact.setValue({fieldId: 'subsidiary', value : 1});
								recContact.setValue({fieldId: 'company', value : idPartner});
								recContact.setValue({fieldId: 'entityid', value : rec.getValue({fieldId: 'custrecord_lic_partner_name'}) + ' Contact'});
								recContact.setValue({fieldId: 'email', value : rec.getValue({fieldId: 'custrecord_lic_pnr_billing_contact_email'})});
								idContact = recContact.save();
							
							rec.setValue({fieldId: 'custrecord_lic_pnr_billing_contact', value: idContact});//missing
					    }
					}
				}
			}			
		}
		
		var id = rec.save();
    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    summarize = function (summary) {
    	
        var errorMsg = [];
        var inputSummary = summary.inputSummary;
        var mapSummary = summary.mapSummary;
        var reduceSummary = summary.reduceSummary;
        
        if(summary.inputSummary.error){
            var msg = 'Error was: ' + summary.inputSummary.error + '\n';
            errorMsg.push(msg);
        }
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
        
        
    	var scriptTask = task.create({taskType: task.TaskType.MAP_REDUCE});
    		scriptTask.scriptId = 'customscript_pullatlassian_lichist_mr';
    		scriptTask.deploymentId = null;
    	var id = scriptTask.submit();
        
    }

    return {

        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
