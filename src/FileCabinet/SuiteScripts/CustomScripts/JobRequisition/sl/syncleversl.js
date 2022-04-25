/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/ui/serverWidget', '../api/jobrequisition'],
/**
 * @param {record} record
 * @param {serverWidget} serverWidget
 */
function(record, serverWidget, jobrequisition) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {

        var objForm;
        var paramReq = context.request.parameters;
        var idJobrequisition = paramReq.jobrequisition;
        
        objForm = serverWidget.createForm({
            title: 'Synchronize Lever'
        });
    	
		var newRec = record.load({
		    type: 'jobrequisition',
		    id: idJobrequisition,
		    isDynamic: true
		});
        
		var result = jobrequisition.syncLever({
		    record: newRec,
		    context: context
		});
		
		 var fldMessage = objForm.addField({
		     id: 'custpage_message',
		     type: serverWidget.FieldType.INLINEHTML,
		     label: 'Message'
		 });
		 
		fldMessage.defaultValue = '<b>'+ result.result.status +'</b><br/>' + result.result.message;
		
		
    	if(true){
    		
    		try {
    		    var id = result.record.save();
    		} 
    		catch (err) {
    		    log.audit({
    		        title: 'afterSubmit',
    		        details: 'Error: ' + err
    		    });
    		}
    	}
		
        context.response.writePage(objForm);
    }

    return {
        onRequest: onRequest
    };
    
});
