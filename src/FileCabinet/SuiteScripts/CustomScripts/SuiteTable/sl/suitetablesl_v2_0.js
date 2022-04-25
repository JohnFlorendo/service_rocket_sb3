/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/file', 'N/ui/serverWidget', 'N/query', '../api/suitetable', '../../Library/handlebars/handlebars', '../../Library/handlebars/handlebarshelper'],
/**
 * @param {serverWidget} serverWidget
 */
function(file, serverWidget, query, suitetable, handlebars, handlebarshelper) {
   
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
		var idStbl = paramReq.stbl;
		var sAction = paramReq.action;
		
		if (sAction == 'backend') {
			
			var objStbl = query.runSuiteQL({
				query: 'SELECT name, custrecord_stbl_filelocation AS filelocation FROM customrecord_suitetable WHERE id = ?',
				params: [idStbl]
			}).asMappedResults()[0];
			
			var objData = suitetable.getData({
				sqlfile: objStbl.filelocation,
				params : []
			});
			
			objData.name = objStbl.name;
			
			context.response.write(JSON.stringify(objData));
		}
		else{
			
			if(idStbl == undefined){
				idStbl = 1;
			}

			var objForm = serverWidget.createForm({
				title: 'SuiteTable v1.0'
			});
	
			var sTableHTML = file.load({
				id: '../template/suitetable_v2_1.html'
			}).getContents();

			var sHandlebar = handlebars.compile(sTableHTML);
			handlebars = handlebarshelper.register(handlebars);
			var sFinishedHtml = sHandlebar({id: idStbl});
			
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
