/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */

/*
Purpose             : Render a Custom Button for Printing Transaction
Created On          : February 14, 2022
Author              : Ceana Technology
Saved Searches      : N/A
*/

define(['N/record','N/search','N/url'],(record, search, url) => {

    const beforeLoad = (scriptContext) => {
        var newRecord = scriptContext.newRecord;
        var form = scriptContext.form;
        var urlLink =  getURL('customscript_sr_sl_print_purchaseorder','customdeploy_sr_sl_print_purchaseorder');
        urlLink += '&custscript_param_transaction_id='+newRecord.id;
        var stOnCall = "window.open('" + urlLink+ "')" ;
        form.addButton({
            id : 'custpage_print',
            label : "Print",
            functionName : stOnCall
        });
    }

    function  getURL(stScript,stDeployment) {
        var urlLink =  url.resolveScript({
            scriptId: stScript,
            deploymentId: stDeployment,
            returnExternalUrl: false
        });

        return urlLink;
    }

    return { beforeLoad }

});