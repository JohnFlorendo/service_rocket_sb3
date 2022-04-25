/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/runtime','N/record','../api/netspot'],

function(runtime, record, netspot) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(scriptContext) {

    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext) {

    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(scriptContext) {
    	
     	var newRec = scriptContext.newRecord;
     	var idMe = runtime.getCurrentUser().id;

     	if (newRec.type != record.Type.OPPORTUNITY) {

     		if (scriptContext.type != 'delete') {
         	    var rec = record.load({
         	        type: newRec.type,
         	        id: newRec.id,
         	        isDynamic: true
         	    });
         	    rec = netspot.sendHubRequest(rec);
         	    var id = rec.save();
     		}
     	} 
     	else {

     	    var rec = record.load({
     	        type: newRec.type,
     	        id: newRec.id,
     	        isDynamic: true
     	    });
     		
     		var result;
     		
     		if(scriptContext.type == 'create'){
         	    
         	   result = netspot.createDeal({record: rec});
         	   
         	   if(result.result.status == 'SUCCESS'){
         		   
          		  result = netspot.associateDeal({
 		         			    record: result.record,
 		         			    id: result.record.getValue('custbody_hubspot_id'),
 		         			    to: result.record.getValue('custbody_hubspot_customer_id'),
 		         			    type: 'companies'
 		         		   });
          	   }
     		}
     		else if(scriptContext.type == 'edit' && newRec.getValue('custbody_hubspot_id') == ''){
        	    
         	   result = netspot.createDeal({record: rec});
         	   
         	   if(result.result.status == 'SUCCESS'){
         		   
         		   result = netspot.associateDeal({
		         			    record: result.record,
		         			    id: result.record.getValue('custbody_hubspot_id'),
		         			    to: result.record.getValue('custbody_hubspot_customer_id'),
		         			    type: 'companies'
		         		   });
         	   }
     		}
     		else if(scriptContext.type == 'edit'){
         	    
     			if(newRec.type == record.Type.CUSTOMER){
     				result = netspot.updateCompany({record: rec});
     			}
				else if(newRec.type == record.Type.OPPORTUNITY){
					result = netspot.updateDeal({record: rec});
				}
     		}
     		
     		var id = result.record.save();
     	}
    	
    }

    return {
        afterSubmit: afterSubmit
    };
    
});
