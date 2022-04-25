/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget','../api/functionwithactivities'],

function(serverWidget, funcactivities) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	var paramReq = context.request.parameters;
    	var idRec = paramReq.functionid;
    	//var sType = paramReq.type;
    	var sHtmlTemplate = funcactivities.generate(idRec);
    	
    	var objForm = serverWidget.createForm({title: 'ServiceRocket Function w/ Activities'});
    	
    	var fldHtml = objForm.addField({
    	    id: 'custpage_htmlfield',
    	    type: serverWidget.FieldType.INLINEHTML,
    	    label: 'HTML Image'
    	});
    	
    	fldHtml.defaultValue = sHtmlTemplate;
    	
    	context.response.writePage(objForm);
    	
    	//context.response.write(sHtmlTemplate);
    	
    }

    return {
        onRequest: onRequest
    };
    
});
