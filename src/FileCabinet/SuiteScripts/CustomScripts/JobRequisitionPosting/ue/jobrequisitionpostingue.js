/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/record','../api/jobrequisitionposting'],

function(runtime, record, jobrequisitionposting) {
   
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
    	
    	var result;
    	var newRec = scriptContext.newRecord;
    	
    	if(runtime.executionContext == runtime.ContextType.USERINTERFACE){
    		
    		newRec = record.load({
    		    type: newRec.type,
    		    id: newRec.id,
    		    isDynamic: true

    		});
    		
    		if(scriptContext.type == scriptContext.UserEventType.CREATE){
    			
				result = jobrequisitionposting.createJobRequisitionPosting({
				    record: newRec,
				    context: scriptContext
				});
        	}
    		else if(scriptContext.type == scriptContext.UserEventType.EDIT){
    			
    			if(newRec.getValue({fieldId: 'custrecord_jr_webflowid'}) == '' || 
    					!newRec.getValue({fieldId: 'custrecord_jr_webflowid'})){
    				
    				result = jobrequisitionposting.createJobRequisitionPosting({
    				    record: newRec,
    				    context: scriptContext
    				});
    			}
    			else{
    				
    				result = jobrequisitionposting.updateJobRequisitionPosting({
    				    record: newRec,
    				    context: scriptContext
    				});
    			}
    			
        	}
    	}
    	
    	if(result.result){
    		
    		try {
    		    var id = result.record.save();
    		} 
    		catch (err) {
    			
    		    log.audit({
    		        title: 'afterSubmit',
    		        details: 'Error: ' + err
    		    });
    		}
    	}
    }

    return {
        afterSubmit: afterSubmit
    };
    
});
