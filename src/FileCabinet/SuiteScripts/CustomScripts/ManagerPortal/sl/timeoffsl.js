/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/query', 'N/file', 'N/ui/serverWidget', '../api/timeoff', '../../Library/handlebars'],
/**
 * @param {file} file
 * @param {serverWidget} serverWidget
 */
function(runtime, query, file, serverWidget, timeoff, handlebars) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {

    	var idMe = (runtime.getCurrentUser().id).toString();
    	var paramReq = context.request.parameters;
    	
    	var sAction = paramReq.action;
    	var sList = paramReq.list;
    	var sTemplate = file.load(182539).getContents();
    	
    	if(sAction == 'backend'){

    		var results;
    		
    		if(sList == 'all'){
    			results = timeoff.getAllBallance(paramReq.idme);
    		}
    		else{
    			results = timeoff.getMyFamilyBalance(paramReq.idme);
    		}
    		
    		context.response.write(JSON.stringify(results));
    	}
    	else{
    		
    		var objForm = serverWidget.createForm({
        	    title: 'Manager Portal 1.0'
        	});
    		
        	var fldHtml = objForm.addField({
        	    id: 'custpage_htmlfield',
        	    type: serverWidget.FieldType.INLINEHTML,
        	    label: 'HTML Image'
        	});
        	
        	var sHandlebar = handlebars.compile(sTemplate);
        	var sHtmlTemplate = sHandlebar({idme: idMe});
        	
        	fldHtml.defaultValue = sHtmlTemplate;

        	context.response.writePage(objForm);
    	}
    }

    return {
        onRequest: onRequest
    };
    
});

