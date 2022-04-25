/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/file',  'N/record', 'N/ui/serverWidget', '../../Helper/nstojson', '../../Library/handlebars'],
/**
 * @param {record} record
 * @param {serverWidget} serverWidget
 */
function(file, record, serverWidget, nstojson, handlebars) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	
    	var sTemplate = file.load(136245);
    	
    	
    	var paramReq = context.request.parameters;
    	var idRec = paramReq.departmentid;
    	
    	var recDepartment = record.load({type: 'department', id: idRec, isDynamic: true});
    	
    	var objDepartment = nstojson.get(recDepartment);
    	objDepartment.ownerimage = '/core/media/media.nl?id=367&c=3688201&h=511e15b5a7516900af5d';
    	
    	
if( recDepartment.getValue({fieldId: 'custrecord_sr_dept_owner'})){
	var recEmployee = record.load({type: 'employee', id: recDepartment.getValue({fieldId: 'custrecord_sr_dept_owner'})});
	var objImage = file.load(recEmployee.getValue({fieldId: 'image'}));
	objDepartment.workplaceid = recEmployee.getValue({fieldId: 'custentity_workplace_id'});
	objDepartment.ownerimage = objImage.url;
}
    	
    	
    	
    	
    	var sHandlebar = handlebars.compile(sTemplate.getContents());
    	
    	
    	var sHtmlTemplate = sHandlebar(objDepartment);

    	context.response.write(sHtmlTemplate);
    	
    	var objForm = serverWidget.createForm({title: 'ServiceRocket Department'});
    	
    	var fldHtml = objForm.addField({
    	    id: 'custpage_htmlfield',
    	    type: serverWidget.FieldType.INLINEHTML,
    	    label: 'HTML Image'
    	});
    	fldHtml.defaultValue = sHtmlTemplate;
    	
    	context.response.writePage(objForm);
    }

    return {
        onRequest: onRequest
    };
    
});
