/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/file', 'N/ui/serverWidget', '../api/suitetable', '../../Library/handlebars/handlebars', '../../Library/handlebars/handlebarshelper'],
/**
 * @param {serverWidget} serverWidget
 */
function(file, serverWidget, suitetable, handlebars, handlebarshelper) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
	onRequest = function (context) {
		
		var paramReq = context.request.parameters;
		var idStbl = paramReq.stblid;
		var sAction = paramReq.action;
		
		
		if (sAction == 'backend') {
			
			var objData = suitetable.getData({
				stblid: idStbl,
				params: []
			});
			
			context.response.write(JSON.stringify(objData));
		}
		else{
			
			var objForm = serverWidget.createForm({
				title: 'SuiteTable'
			});
			
			var objData = suitetable.getData({
				stblid: idStbl,
				params: []
			});
			
			var sTableHTML = file.load({id: '../template/suitetable.html'}).getContents();

			var sHandlebar = handlebars.compile(sTableHTML);
			handlebars = handlebarshelper.register(handlebars);
			var sFinishedHtml = sHandlebar(objData);
			
			var fldHtml = objForm.addField({
				id: 'custpage_sfield',
				type: serverWidget.FieldType.INLINEHTML,
				label: 'HTML'
			});
			
			fldHtml.defaultValue = sFinishedHtml;

			context.response.writePage(objForm);			
		}

		
    };

    return {
        onRequest: onRequest
    };
    
});
