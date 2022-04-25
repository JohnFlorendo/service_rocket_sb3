/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/query', 'N/file', 'N/ui/serverWidget', '../api/requisition', '../../Library/handlebars', '../../Library/handlebars/handlebarshelper'],
	/**
	 * @param {file} file
	 * @param {serverWidget} serverWidget
	 */
	function (record, runtime, query, file, serverWidget, requisition, handlebars, handlebarshelper) {

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
			var sList = paramReq.list;
			var sTemplate = file.load({
				id: 'SuiteScripts/CustomScripts/MyPurchases/template/myrequisitions_v1_1.html'
			}).getContents(); //mytemplate_v1_0.html
			
			var arrParams = [];
			
			if (sAction == 'backend') {

				
				if(idMe == 171596){
					idMe = 8755;
				}
			
				var arrData;
				
				if(sList == 'pending'){
					arrData = requisition.getMyApproval({params: [idMe, idMe, -6, -6]});
				}
				else if(sList == 'approved'){
					arrData = requisition.getApproved({params: [idMe, idMe, -6, -6]});
				}
				else if(sList == 'mine'){
					arrData = requisition.getMine({params: [-6, -6, -6, idMe]});
				}
				
	    		context.response.setHeader({
	          		name: 'Content-Type',
	          		value: 'application/json'
	        	});
				
				context.response.write(JSON.stringify(arrData));
			}
			else {

				var objForm = serverWidget.createForm({
					title: 'MyPurchases 1.0'
				});

				var fldHtml = objForm.addField({
					id: 'custpage_htmlfield',
					type: serverWidget.FieldType.INLINEHTML,
					label: 'HTML'
				});
				
				var sHandlebar = handlebars.compile(sTemplate);
				handlebars = handlebarshelper.register(handlebars);
				
				var sHtmlTemplate = sHandlebar({});

				fldHtml.defaultValue = sHtmlTemplate;

				context.response.writePage(objForm);
				//context.response.write(sHtmlTemplate);
			}
		}

		return {
			onRequest: onRequest
		};

	});

