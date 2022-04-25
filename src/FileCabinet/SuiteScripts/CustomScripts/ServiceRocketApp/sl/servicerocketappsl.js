/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/file', 'N/ui/serverWidget', '../../Library/handlebars/handlebars', '../../Library/handlebars/handlebarshelper'],
/**
 * @param {serverWidget} serverWidget
 */
function(file, serverWidget, handlebars, handlebarshelper) {
   
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
		var sAction='';
		if (sAction == 'backend') {

			
			context.response.write(JSON.stringify({}));
		}
		else{
			
			var objForm = serverWidget.createForm({
				title: 'MyServiceRocket Apps'
			});
						
			var sTableHTML = file.load({id: '../template/myapps_v1_0.html'}).getContents();

			var sHandlebar = handlebars.compile(sTableHTML);
			handlebars = handlebarshelper.register(handlebars);
			var sFinishedHtml = sHandlebar({});
			
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
