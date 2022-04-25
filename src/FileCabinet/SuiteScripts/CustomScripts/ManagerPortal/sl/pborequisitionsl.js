/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/query', 'N/file', 'N/ui/serverWidget', '../api/jobrequisition', '../../Library/handlebars', '../../Library/handlebars/handlebarshelper'],
	/**
	 * @param {file} file
	 * @param {serverWidget} serverWidget
	 */
	function (record, runtime, query, file, serverWidget, jobrequisition, handlebars, handlebarshelper) {

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
			var idMe = runtime.getCurrentUser().id;
			
			var sAction = paramReq.action;
			var sTemplate = file.load({
				id: 233999
			}).getContents(); //pbojobrequisition_v1_0.html
			
			var arrParams = [];
			
			if (paramReq.pbo) {
				arrParams = [paramReq.pbo, 1000000000];
			}
			else if (paramReq.hrmanager) {
				arrParams = [paramReq.pbo, 1000000000];
			}
			else if(idMe == 171596 || idMe == 9134 || idMe == 8103 || idMe == 8582){
				arrParams = [idMe, -6];
			}
			else{
				arrParams = [idMe, 1000000000];
			}
			
						
			if (sAction == 'backend') {

				var arrData = jobrequisition.getPboRequisition({id: arrParams});
				
				context.response.write(JSON.stringify(arrData));
			}
			else {

				var objForm = serverWidget.createForm({
					title: 'MyJobRequisitions 1.0'
				});

				var fldHtml = objForm.addField({
					id: 'custpage_htmlfield',
					type: serverWidget.FieldType.INLINEHTML,
					label: 'HTML'
				});
				
				var arrData = jobrequisition.getPboRequisition({id: arrParams});
				arrData.id = idMe;
				var sHandlebar = handlebars.compile(sTemplate);
				handlebars = handlebarshelper.register(handlebars);
				
				var sHtmlTemplate = sHandlebar(arrData);

				fldHtml.defaultValue = sHtmlTemplate;

				context.response.writePage(objForm);
				//context.response.write(sHtmlTemplate);
			}
		}

		return {
			onRequest: onRequest
		};

	});

