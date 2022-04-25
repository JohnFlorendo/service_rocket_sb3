/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/error'],
/**
 * @param {record} record
 * @param {runtime} runtime
 * @param {error} error
 */
function(record, runtime, error) {
   
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
    	    	
    	try {
    		
			var newRec = scriptContext.newRecord;
			
			var recLog = record.create({
				type : 'customrecord_rocketeercard_logs',
				isDynamic : true
			});
			recLog.setValue({
				fieldId : 'custrecord_rcl_card',
				value : newRec.id
			});
			recLog.setValue({
				fieldId : 'custrecord_rcl_employee',
				value : runtime.getCurrentUser().id
			});
			recLog.setValue({
				fieldId : 'custrecord_rcl_activity',
				value : scriptContext.type
			});
			var id = recLog.save();
		} catch (err) {
			log.audit({
			    title: 'rocketeercardue.beforeLoad',
			    details: 'err: ' + err
			});
		}
		
		if (scriptContext.type == scriptContext.UserEventType.VIEW
				|| scriptContext.type == scriptContext.UserEventType.EDIT) {

			if (newRec.getValue({
				fieldId : 'custrecord_rc_employee'
			}) != runtime.getCurrentUser().id) {

				var logErr = error.create({
							name : 'PERMISSION_VIOLATION',
							message : 'You are do not have permission to access this record. This record is being monitored.',
							notifyOff : true
						});
				throw logErr;
			}
		}
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
			var recLog = record.create({
				type : 'customrecord_rocketeercard_logs',
				isDynamic : true
			});
			recLog.setValue({
				fieldId : 'custrecord_rcl_card',
				value : scriptContext.newRecord.id
			});
			recLog.setValue({
				fieldId : 'custrecord_rcl_employee',
				value : runtime.getCurrentUser().id
			});
			recLog.setValue({
				fieldId : 'custrecord_rcl_activity',
				value : scriptContext.type
			});
			var id = recLog.save();
		} catch (err) {
			log.audit({
			    title: 'rocketeercardue.afterSubmit',
			    details: 'err: ' + err
			});
		}
    }

    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit
    };
    
});
