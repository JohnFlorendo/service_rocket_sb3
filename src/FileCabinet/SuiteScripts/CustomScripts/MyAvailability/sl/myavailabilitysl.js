/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/query', 'N/file', 'N/ui/serverWidget', '../api/availability', '../../Library/handlebars'],
/**
 * @param {file} file
 * @param {serverWidget} serverWidget
 */
function(runtime, query, file, serverWidget, availability, handlebars) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {

    	var idMe = runtime.getCurrentUser().id;
    	var paramReq = context.request.parameters;
    	var idHrManager = paramReq.hrmanager ? paramReq.hrmanager : 0;
		var idManager = paramReq.manager ? paramReq.manager : 0;
    	var sAction = paramReq.action;
    	var sTemplate = file.load(241816).getContents();//183689
    	
    	if(sAction == 'backend'){
    		
    		
    		if (idHrManager > 0 && idMe == idHrManager){
				idMe = paramReq.employee;
			}
			else if (idManager > 0 && idMe == idManager){
				idMe = paramReq.employee;
			}
    		
			var objSqlParams = {
					'{{id}}' :  idMe,
					'{{hrmanager}}': idHrManager,
					'{{manager}}': idManager};
    		
    		
    		var results = availability.getMyAvailability(objSqlParams);
    		context.response.write(JSON.stringify(results));
    	}
    	else{
        	
			log.audit({
				title: 'Check-in',
				details: new Date()
			});
    		
    		var objForm = serverWidget.createForm({
        	    title: 'MyAvailability 1.0'
        	});
    		
        	var fldHtml = objForm.addField({
        	    id: 'custpage_htmlfield',
        	    type: serverWidget.FieldType.INLINEHTML,
        	    label: 'HTML Image'
        	});
        	
        	var sHandlebar = handlebars.compile(sTemplate);
        	var sHtmlTemplate = sHandlebar({});
        	
        	fldHtml.defaultValue = sHtmlTemplate;

        	context.response.writePage(objForm);
    	}
    }

    return {
        onRequest: onRequest
    };
    
});

