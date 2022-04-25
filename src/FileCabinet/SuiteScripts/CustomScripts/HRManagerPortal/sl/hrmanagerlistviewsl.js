/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/query', 'N/file', 'N/search', 'N/ui/serverWidget', '../api/hrlist', '../../Library/handlebars', '../../Library/handlebars/handlebarshelper'],
	/**
	 * @param {file} file
	 * @param {serverWidget} serverWidget
	 */
	function (record, runtime, query, file, search, serverWidget, hrlist, handlebars, handlebarshelper) {

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
								id: '../template/hrmanagerlistview_v1_3.html'
							}).getContents(); //203624, 229500
			
			if(idMe == 171596){
//				sTemplate = file.load({
//					id: '../template/htmltest.html'
//				}).getContents(); //203624, 229500
				
				idMe = -5;
			}
			
			if (sAction == 'backend') {
			
				var arrData=[];
				
				if(sList == 'prehire'){
					arrData = hrlist.getPrehireRocketeers({id: paramReq.idme});
				}
				else if (sList == 'active'){
					arrData = hrlist.getActiveRocketeers({id: paramReq.idme});
				}
				else if (sList == 'leave'){
					arrData = hrlist.getLeaveRocketeers({id: paramReq.idme});
				}
				else if (sList == 'terminated'){
					arrData = hrlist.getTerminatedRocketeers({id: paramReq.idme});
				}
				else if (sList == 'jobrequisition'){
					arrData = hrlist.getJobRequisitions({id: paramReq.idme});
				}
				
				context.response.write(JSON.stringify({data: arrData}));
			}
			else {
				
				if (paramReq.hrmanager && (idMe == -5 || idMe == 171596)) {
					idMe = paramReq.hrmanager;
				}

				var objForm = serverWidget.createForm({
					title: 'HR Manager View 1.1'
				});

				var fldHtml = objForm.addField({
					id: 'custpage_htmlfield',
					type: serverWidget.FieldType.INLINEHTML,
					label: 'HTML Image'
				});

				var sHandlebar = handlebars.compile(sTemplate);
				handlebars = handlebarshelper.register(handlebars);
				
				var sHtmlTemplate = sHandlebar({idme: idMe});
				
				var sHandlebar = handlebars.compile(sHtmlTemplate);
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

