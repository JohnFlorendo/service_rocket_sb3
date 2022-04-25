/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime','../api/marketplacetransaction'],
/**
 * @param {record} record
 */
function(record, runtime, marketplacetransaction) {
   
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

    	if (newRec.getValue({
            	fieldId: 'custrecord_mp_type'
        	}) == 2) {

	        if (scriptContext.type == scriptContext.UserEventType.EDIT) {
	
	            if (runtime.executionContext == runtime.ContextType.USER_INTERFACE || runtime.executionContext == runtime.ContextType.CSV_IMPORT) {
	
	                var rec = record.load({
	                    type: newRec.type,
	                    id: newRec.id,
	                    isDynamic: true
	                });
	
	                rec = marketplacetransaction.updateInvoice(rec);
	
	                var id = rec.save();
	
	            }
	        }
    	}
    }

    return {
        afterSubmit: afterSubmit
    };
    
});
