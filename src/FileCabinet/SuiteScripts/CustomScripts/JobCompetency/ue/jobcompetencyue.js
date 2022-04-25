/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', '../api/jobcompetency'],
/**
 * @param {record} record
 * @param {runtime} runtime
 */
function(record, runtime, jobcompetency) {
   
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
    	
    	if(runtime.executionContext !== runtime.ContextType.USERINTERFACE){
    		
    		if(scriptContext.type == scriptContext.UserEventType.CREATE ||
        			scriptContext.type == scriptContext.UserEventType.EDIT){
        		
    			jobcompetency.updateFuncMapFields(newRec);
        	}	
    		
    	}
    }

    return {
        afterSubmit: afterSubmit
    };
    
});
