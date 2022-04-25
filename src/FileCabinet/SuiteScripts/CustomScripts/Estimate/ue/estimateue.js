/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/url', 'N/ui/serverWidget', 'N/file', '../api/estimate'],
    /**
     * @param {runtime} runtime
     * @param {record} record
     */

    function (record, runtime, url, serverWidget, file, estimate) {

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
	beforeLoad = function (scriptContext) {

        var currForm = scriptContext.newRecord;

        try {

            if (scriptContext.type == scriptContext.UserEventType.CREATE) {
                estimate.setUserAsPrimarySalesRepBeforeLoad(currForm, runtime.getCurrentUser().id);
            } 
            else if (scriptContext.type == scriptContext.UserEventType.VIEW) {

                var form = scriptContext.form;
                var newRec = scriptContext.newRecord;
                var html = file.load({
                    id: 168778
                }).getContents(); //btnhtml.html

                var insertHml = form.addField({
                    id: 'custpage_pa_jquery1',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'JQ'
                });

                if (['1', '3', '4'].indexOf(newRec.getValue('custbody_quote_type')) > -1) {

                    var sURL = url.resolveScript({
                        scriptId: 'customscript_suitepdf_sl',
                        deploymentId: 'customdeploy_suitepdf_sl'
                    });
                    sURL += '&type=estimate&id=' + newRec.id;

                    html = html.replace('{surl1}', sURL);

                    insertHml.defaultValue = html;

                    form.addButton({
                        id: 'custpage_btn_print',
                        label: 'Generate Product Quote',
                        functionName: 'printProductQoute'
                    });
                } 
                else if (newRec.getValue('custbody_quote_type') == 2 ) {

                    var sURL = url.resolveScript({
                        scriptId: 'customscript_suitepdf_sl',
                        deploymentId: 'customdeploy_suitepdf_sl'
                    });
                    sURL += '&type=estimate&id=' + newRec.id;

                    html = html.replace('{surl2}', sURL);
                    insertHml.defaultValue = html;

                    form.addButton({
                        id: 'custpage_btn_print',
                        label: 'Print Statement of Work',
                        functionName: 'printSow'
                    });
                }
            }
        } 
        catch (err) {
            log.audit({
                title: 'estimate.beforeLoad',
                details: 'err: ' + err
            });
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
    beforeSubmit = function (scriptContext) {}

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    afterSubmit = function (scriptContext) {

        var newRec = scriptContext.newRecord;

        if (scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.EDIT) {

            try {

                newRec = record.load({
                    type: newRec.type,
                    id: newRec.id,
                    isDynamic: true
                });

                newRec = estimate.computeMargin(newRec);

                //var idEst = newRec.save();

            } catch (err) {
                log.audit({
                    title: 'estimate.afterSubmit',
                    details: 'err: ' + err
                });
            }
        }
    }

    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit
    };

});
