/**
 * @NApiVersion 2.x
 * @NScriptType workflowactionscript
 */
define(['N/record', 'N/runtime', '../api/jobrequisition'],
/**
 * @param {record} record
 * @param {runtime} runtime
 */
function(record, runtime, jobrequisition) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @Since 2016.1
     */
    function onAction(scriptContext) {
    	
    	var newRec = scriptContext.newRecord;
    	
    	newRec = record.load({
		    type: newRec.type,
		    id: newRec.id,
		    isDynamic: true

		});
    	
		result = jobrequisition.syncLever({
		    record: newRec,
		    context: scriptContext
		});

    }

    return {
        onAction : onAction
    };
    
});
