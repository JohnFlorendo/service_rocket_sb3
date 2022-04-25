/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/file'],

function(serverWidget, file) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	
    	var sTemplate = file.load(181828).getContents();
    	
    	
    	
    	//context.response.write(sTemplate);
    	
    	
    	var objForm = serverWidget.createForm({title: 'ServiceRocket Highcharts Testing'});
    	
    	var fldHtml = objForm.addField({
    	    id: 'custpage_htmlfield',
    	    type: serverWidget.FieldType.INLINEHTML,
    	    label: 'HTML Image'
    	});
    	fldHtml.defaultValue = sTemplate;
    	
    	//context.response.write(JSON.stringify(objDepartments));
    	context.response.writePage(objForm);
    	
    	
    	
    }

    return {
        onRequest: onRequest
    };
    
});
