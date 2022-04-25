define(['N/record', 'N/https', '../../../Helper/nsmapjson'],

function(record, https, nsmapjson) {
	
	var COLLECTION_ID = "60dda0d9b05836ec9fba8d32";//My Dev
	//var COLLECTION_ID = "60e3acd4146a4d93992c0207";//SR Staging
	
	var JRP_NEW_MAP_ID = 103;
	var JRP_EDIT_MAP_ID = 108;
	
	generatePayload = function(newRec){
		
		var rec = newRec;
		var idMap = JRP_NEW_MAP_ID;
		
		if (rec.getValue({
	        fieldId: 'custrecord_jr_webflowid'
	    })) {
			idMap = JRP_EDIT_MAP_ID;
		}
		
        var recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: idMap
        });

        var objJobRequisitionMap = JSON.parse(recMapping.getValue({
            fieldId: 'custrecord_intmap_mapping'
        }));
		
		var objPayload = {};
		
        for (var key in objJobRequisitionMap) {

        	objPayload = nsmapjson.nsMap({
                mapping: objJobRequisitionMap,
                record: rec,
                data: objPayload,
                key: key
            });
        }
        
        return objPayload;
	}
	
	
	createJobRequisitionPosting = function(option){
		
		try {
			var retMe = option;
			
			var objPayload = generatePayload(option.record);
			var resp = https.post({
				url : "https://api.webflow.com/collections/" + COLLECTION_ID
						+ "/items?access_token={custsecret_webflow_dev}",
				body : JSON.stringify(objPayload),
				headers : {
					'Content-Type' : 'application/json',
					'accept-version' : '1.0.0',
				},
				credentials : [ 'custsecret_webflow_dev' ]
			});
			
			if (resp.code == 200) {
				
				var objBody = JSON.parse(resp.body);

				retMe.result = {
					status : 'SUCCESS',
					id : objBody._id,
					message : 'Created at ' + (new Date()).toString()
				};

				retMe.record.setValue({
				    fieldId: 'custrecord_jr_webflowid',
				    value: retMe.result.id
				});
				retMe.record.setValue({
				    fieldId: 'custrecord_jr_logs',
				    value: retMe.result.status + ': ' + retMe.result.message
				});
			} 
			else {

				var objBody = JSON.parse(resp.body);
				
				retMe.result = {
					status : 'FAILED',
					message : resp.code + ': ' + objBody.msg
				};
				
				retMe.record.setValue({
				    fieldId: 'custrecord_jr_logs',
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
			    fieldId: 'custrecord_jr_logs',
			    value: retMe.result.status + ': ' + retMe.result.message
			});
			
		}
		
		return retMe;
	};
	
	updateJobRequisitionPosting = function(option){
		
		try {
			
			var retMe = option;
			var objPayload = generatePayload(option.record);
			
			var resp = https.put({
				url : "https://api.webflow.com/collections/" + COLLECTION_ID
						+ "/items/" + option.record.getValue({
							fieldId : 'custrecord_jr_webflowid'
						}) + "?access_token={custsecret_webflow_dev}",
				body : JSON.stringify(objPayload),
				headers : {
					'Content-Type' : 'application/json',
					'accept-version' : '1.0.0',
				},
				credentials : [ 'custsecret_webflow_dev' ]
			});
			
			if (resp.code == 200) {

				var objBody = JSON.parse(resp.body);

				retMe.result = {
					status : 'SUCCESS',
					id : objBody._id,
					message : 'Updated at ' + (new Date()).toString()
				};

				retMe.record.setValue({
					fieldId : 'custrecord_jr_logs',
					value : retMe.result.status + ': ' + retMe.result.message
				});
			} 
			else {

				var objBody = JSON.parse(resp.body);
				
				retMe.result = {
					status : 'FAILED',
					message : resp.code + ': ' + objBody.msg
				};

				retMe.record.setValue({
					fieldId : 'custrecord_jr_logs',
					value : retMe.result.status + ': ' + retMe.result.message
				});
			}
		} 
		catch (err) {
			
			retMe.result = {
					status : 'FAILED',
					message : err
				};
			
			retMe.record.setValue({
			    fieldId: 'custrecord_jr_logs',
			    value: retMe.result.status + ': ' + retMe.result.message
			});
			
			
		}
	
    	return retMe;
	};
	
    return {
    	createJobRequisitionPosting: createJobRequisitionPosting,
    	updateJobRequisitionPosting: updateJobRequisitionPosting
    };
    
});
