/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/runtime', '../api/purchaserequisition'],

function(runtime, purchaserequesition) {
   
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

        try {

        	var isUpdated = false;
            var newRecord = scriptContext.newRecord;
            var newRec = record.load({type: newRecord.type, id: newRecord.id, isDynamic : true });
            
            if(scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.EDIT) {
            	
            	if(scriptContext.type == scriptContext.UserEventType.CREATE && runtime.executionContext === runtime.ContextType.USER_INTERFACE){
            		
            		var objFolder = purchaserequesition.createFolder(newRec);
            		log.audit({title: 'afterSubmit', details: 'folder:' + JSON.stringify(objFolder)});
            	}
            }
            
            if(isUpdated){
            	newRec.save();
            }
            
            
        } catch(e) { log.debug('ERROR', e); }
    }

    return {
        afterSubmit: afterSubmit
    };
    
});
