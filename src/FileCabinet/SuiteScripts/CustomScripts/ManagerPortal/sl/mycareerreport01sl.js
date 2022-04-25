/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/file', 'N/ui/serverWidget', '../api/mycareer', '../../Library/handlebars/handlebars', '../../Library/handlebars/handlebarshelper'],
/**
 * @param {serverWidget} serverWidget
 */
function(runtime, file, serverWidget, mycareer, handlebars, handlebarshelper) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
	onRequest = function (context) {
		
		var idMe = runtime.getCurrentUser().id;
		var paramReq = context.request.parameters;
		var sAction = paramReq.action;
		var sList = paramReq.list;
		var sType = paramReq.type;
		
		if (sAction == 'backend') {
			
			var objData;
			
			if(sList == 'workingtobe'){
				
				if(sType == 'manager'){
					
					objData = mycareer.getMyCareerWorktingToBe({
						params: [idMe, 100000000000]
					});	
				}
				else if (sType == 'recruiter'){
					
					objData = mycareer.getMyCareerWorktingToBe({
						params: [-6, 0]
					});
				}
				
				
			}
			else if(sList == 'interested'){

				if(sType == 'manager'){
					
					objData = mycareer.getMyCareerInterested({
						params: [idMe, 100000000000]
					});	
				}
				else if (sType == 'recuiter'){
					
					objData = mycareer.getMyCareerInterested({
						params: [-6, 0]
					});
				}

			}
			else if(sList == 'all'){
				objData = mycareer.getMyCareerList({
					params: [idMe,  idMe]
				});
			}
			
			context.response.write(JSON.stringify(objData));
		}
		else{

			var bType = ({
		        'me'  : true,
		        'manager' : false,
		        'recruiter' : false
			})[sType]; 
			
			var sTitle = '';
			
			if (sType == 'me'){
				sTitle = 'Rockeeter View';
			}
			else if (sType == 'me'){
				sTitle = 'Manager View';
			}
			else if (sType == 'recruiter'){
				sTitle = 'Recuiter View';
			}
			
			var objForm = serverWidget.createForm({
				title: 'MyCareer ' + sTitle + ' 1.0',
				hideNavBar: bType
			});

			var sTableHTML = file.load({id: '../template/mrcareerreport01_v1_0.html'}).getContents();

			var sHandlebar = handlebars.compile(sTableHTML);
			handlebars = handlebarshelper.register(handlebars);
			
			var sFinishedHtml = sHandlebar({
				individual: bType,
				type: sType
			});
			
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
