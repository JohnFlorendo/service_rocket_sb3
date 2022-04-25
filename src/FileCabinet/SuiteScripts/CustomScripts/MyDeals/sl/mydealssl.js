/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/query', 'N/file', 'N/ui/serverWidget','../api/deal', '../../Library/handlebars', '../../Library/handlebars/handlebarshelper'],
	/**
	 * @param {file} file
	 * @param {serverWidget} serverWidget
	 */
	function (record, runtime, query, file, serverWidget, deal, handlebars, handlebarshelper) {

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
				id: 'SuiteScripts/CustomScripts/MyDeals/template/mydeals_v1_1.html'
			}).getContents();
						
			if (sAction == 'backend') {
				
				var arrData = [];
				
				if(sList == 'active'){
					arrData = deal.getDeals({
						params: [idMe,'Opportunity : In Progress','Opportunity : Issued Estimate']
					});
				}
				else if(sList == 'won'){
					arrData = deal.getDeals({
						params: [idMe,'Opportunity : Closed - Won','Opportunity : Closed - Won']
					});
				}
				else if(sList == 'lost'){
					arrData = deal.getDeals({
						params: [idMe,'Opportunity : Closed - Lost','Opportunity : Closed - Lost']
					});
				}
				
	    		context.response.setHeader({
	          		name: 'Content-Type',
	          		value: 'application/json'
	        	});
				
				context.response.write(JSON.stringify(arrData));
			}
			else {

				var objForm = serverWidget.createForm({
					title: 'MyDeals 1.1'
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

