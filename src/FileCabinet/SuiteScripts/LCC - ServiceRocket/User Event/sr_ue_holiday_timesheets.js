/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */

/*
Purpose             : Call the Map/Reduce Script that will create a holiday timesheets
Created On          : April 13, 2022
Author              : Ceana Technology
Saved Searches      : N/A
*/

define(['N/record', 'N/search', 'N/task', 'N/runtime'], (record, search, task, runtime) => {
    var Job_Offer_Not_Accepted = 13;
    var Rocketeer_Form_Job_Offer = 137;

    const beforeSubmit = (scriptContext) => {
        log.debug('beforeSubmit', 'Start');
        var newRecord = scriptContext.newRecord;

        var inEmployee = runtime.getCurrentUser().id;

        if (inEmployee == 650 || inEmployee == 104052 || inEmployee == 14189 || inEmployee == 1060238) {
            var inForm = newRecord.getValue({
                fieldId: 'customform'
            });
            var inEmployeeStatus = newRecord.getValue({
                fieldId: 'employeestatus'
            });
            var isInactive = newRecord.getValue({
                fieldId: 'isinactive'
            });
            log.debug('before isInactive', isInactive)

            log.debug('fields', 'inForm: ' + inForm + ' - inEmployeeStatus: ' + inEmployeeStatus);
            if (inForm == Rocketeer_Form_Job_Offer && inEmployeeStatus == Job_Offer_Not_Accepted) {
                log.debug('set isinactive field to True');
                newRecord.setValue({
                    fieldId: 'isinactive',
                    value: true
                });
            }

            var isInactive = newRecord.getValue({
                fieldId: 'isinactive'
            });
            log.debug('after isInactive', isInactive)
        }
        log.debug('beforeSubmit', 'End: ' + newRecord.id);
    }

    const afterSubmit = (scriptContext) => {
        let newRecord = scriptContext.newRecord;
        if (newRecord.type == 'create') {
            var taskId = task.create({
                taskType: task.TaskType.MAP_REDUCE,
                scriptId: "customscript_sr_holiday_time_sheets",
                deploymentId: "customdeploy_sr_holiday_ue_trigger",
                params: {
                    custscript_mr_emp_list: newRecord.id
                }
            }).submit();
            log.debug(newRecord.type, taskId);
        }
    }

    return {beforeSubmit, afterSubmit}

});