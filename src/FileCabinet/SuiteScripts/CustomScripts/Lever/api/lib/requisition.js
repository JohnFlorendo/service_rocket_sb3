define(['N/record', 'N/https', './user', '../../../Helper/nsmapjson', '../../../Library/momentjs/moment'],
/**
 * @param {https} https
 */
function(record, https, user, nsmapjson, moment) {
	
	var REQUISITION_NEW_MAP_ID = 109; 
	var REQUISITION_EDIT_MAP_ID = 109;
	
	generatePayload = function(rec){
		
		var idMap = REQUISITION_NEW_MAP_ID;
		
		if (rec.getValue({
	        fieldId: 'custrecord_leverid'
	    })) {
			idMap = REQUISITION_EDIT_MAP_ID;
		}
		
        var recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: idMap
        });

        var objMap = JSON.parse(recMapping.getValue({
            fieldId: 'custrecord_intmap_mapping'
        }));
		
		var objPayload = {};
		
        for (var key in objMap) {

        	objPayload = nsmapjson.nsMap({
                mapping: objMap,
                record: rec,
                data: objPayload,
                key: key
            });
        }
        
        return objPayload;
	};
   
	create = function(option){
		
		try {
			var retMe = option;
			
			var objPayload = generatePayload(option.record);
			
			try {
				//Title Quick Fix
				var dTargetDate = option.record.getValue('targethiredate');
				var objMoment = moment(dTargetDate);
				var nWeekNumber = parseInt(objMoment.isoWeek());
				var nYear = parseInt(objMoment.get('year'));
				
				
				//Customer Success Manager, Workplace [Pending Approval - Target 2021.W26]
				objPayload.name  = objPayload.name + ' [' + option.record.getText('requisitionstatus')
						+ ' - Target: ' + nYear +'.W' +nWeekNumber +']';
			} 
			catch (err) {
				log.audit({
				    title: 'requisition.create',
				    details: 'error title' + err
				});
			}
			
			
			//add user look up
			var objHiring = user.search({email: option.record.getValue('custrecord_jr_hiringmanager_email')});
			
			if(objHiring.result.data.data.length > 0){
				objPayload.hiringManager = objHiring.result.data.data[0].id;	
			}
			else{
				
				retMe.result = {
						status : 'FAILED',
						message : 'Hiring Manager does not exist in Lever. Please have them sign up for an account at https://hire.lever.co/'
					};
					
					retMe.record.setValue({
					    fieldId: 'custrecord_jr_leverlogs',
					    value: retMe.result.status + ': ' + retMe.result.message
					});
					
				return retMe;
			}

			var objOwner = user.search({email: option.record.getValue('custrecord_jr_approveremail')});

			if(objOwner.result.data.data.length > 0){
				objPayload.owner = objOwner.result.data.data[0].id;	
			}
			else{
				
				retMe.result = {
						status : 'FAILED',
						message : 'Owner does not exist in Lever. Please have them sign up for an account at https://hire.lever.co/'
					};
					
				retMe.record.setValue({
				    fieldId: 'custrecord_jr_leverlogs',
				    value: retMe.result.status + ': ' + retMe.result.message
				});
					
				return retMe;
			}
			
			var resp = https.post({
				url : "https://api.lever.co/v1/requisitions",
				body : JSON.stringify(objPayload),
				headers : {
					'Authorization' : 'Basic {custsecret_lever_apikey}', 
					'Content-Type' : 'application/json'
				},
				credentials : [ 'custsecret_lever_apikey' ]
			});
			
			if (resp.code == 200 || resp.code == 201) {
				
				var dDate = new Date();
				
				var objBody = JSON.parse(resp.body);

				retMe.result = {
					status : 'SUCCESS',
					id : objBody.data.id,
					message : 'Created at ' + (new Date()).toString()
				};

				retMe.record.setValue({
				    fieldId: 'custrecord_jr_leverid',
				    value: retMe.result.id
				});
				retMe.record.setValue({
				    fieldId: 'custrecord_jr_leverlogs',
				    value: retMe.result.status + ': ' + retMe.result.message
				});
				
				retMe.record.setValue({
				    fieldId: 'custrecord_jr_datecreated_lever',
				    value: dDate
				});
			} 
			else {

				var objBody = {};
				
				try {
					objBody = JSON.parse(resp.body);
				}
				catch (err) {
					
					var e = err;
					objBody.message = resp.body;
				}
				
				retMe.result = {
					status : 'FAILED',
					message : resp.code + ': ' + objBody.message
				};
				
				retMe.record.setValue({
				    fieldId: 'custrecord_jr_leverlogs',
				    value: retMe.result.status + ': ' + retMe.result.message
				});
				
			}
		} 

		catch (err) {

			retMe.result = {
					status : 'FAILED',
					message : err
				};
			
			retMe.record.setValue({
			    fieldId: 'custrecord_jr_leverlogs',
			    value: retMe.result.status + ': ' + retMe.result.message
			});
			
		}
		
		return retMe;
	};
	
	update = function(option){
		
		try {
			var retMe = option;
			
			var objPayload = generatePayload(option.record);
			
			try {
				//Title Quick Fix
				var dTargetDate = option.record.getValue('targethiredate');
				var objMoment = moment(dTargetDate);
				var nWeekNumber = parseInt(objMoment.isoWeek());
				var nYear = parseInt(objMoment.get('year'));
				
				
				//Customer Success Manager, Workplace [Pending Approval - Target 2021.W26]
				objPayload.name  = objPayload.name + ' [' + option.record.getText('requisitionstatus')
						+ ' - Target: ' + nYear +'.W' +nWeekNumber +']';
			} 
			catch (err) {
				log.audit({
				    title: 'requisition.create',
				    details: 'error title' + err
				});
			}
			
			
			//add user look up
			var objHiring = user.search({email: option.record.getValue('custrecord_jr_hiringmanager_email')});
			
			if(objHiring.result.data.data.length > 0){
				objPayload.hiringManager = objHiring.result.data.data[0].id;	
			}
			else{
				
				retMe.result = {
						status : 'FAILED',
						message : 'Hiring Manager does not exist in Lever. Please have them sign up for an account at https://hire.lever.co/'
					};
					
					retMe.record.setValue({
					    fieldId: 'custrecord_jr_leverlogs',
					    value: retMe.result.status + ': ' + retMe.result.message
					});
					
				return retMe;
			}

			var objOwner = user.search({email: option.record.getValue('custrecord_jr_approveremail')});

			if(objOwner.result.data.data.length > 0){
				objPayload.owner = objOwner.result.data.data[0].id;	
			}
			else{
				
				retMe.result = {
						status : 'FAILED',
						message : 'Owner does not exist in Lever. Please have them sign up for an account at https://hire.lever.co/'
					};
					
					retMe.record.setValue({
					    fieldId: 'custrecord_jr_leverlogs',
					    value: retMe.result.status + ': ' + retMe.result.message
					});
					
				return retMe;
			}
			
			
			var resp = https.put({
				url : "https://api.lever.co/v1/requisitions/" + option.record.getValue('custrecord_jr_leverid'),
				body : JSON.stringify(objPayload),
				headers : {
					'Authorization' : 'Basic {custsecret_lever_apikey}', 
					'Content-Type' : 'application/json'
				},
				credentials : [ 'custsecret_lever_apikey' ]
			});
			
			if (resp.code == 200 || resp.code == 201) {
				
				var dDate = new Date();
				
				var objBody = JSON.parse(resp.body);

				retMe.result = {
					status : 'SUCCESS',
					message : 'Updated at ' + (new Date()).toString()
				};

				retMe.record.setValue({
				    fieldId: 'custrecord_jr_leverlogs',
				    value: retMe.result.status + ': ' + retMe.result.message
				});
				
				retMe.record.setValue({
				    fieldId: 'custrecord_jr_lastsync_lever',
				    value: dDate
				});
			} 
			else {

				var objBody = {};
				
				try {
					objBody = JSON.parse(resp.body);
				}
				catch (err) {
					var e = err;
					objBody.message = resp.body;
				}
				
				retMe.result = {
					status : 'FAILED',
					message : resp.code + ': ' + objBody.message
				};
				
				retMe.record.setValue({
				    fieldId: 'custrecord_jr_leverlogs',
				    value: retMe.result.status + ': ' + retMe.result.message
				});
				
			}
		} 

		catch (err) {

			retMe.result = {
					status : 'FAILED',
					message : err
				};
			
			retMe.record.setValue({
			    fieldId: 'custrecord_jr_leverlogs',
			    value: retMe.result.status + ': ' + retMe.result.message
			});
			
		}
		
		return retMe;
	};
	
    return {
    	create : create,
    	update: update
    };
    
});
