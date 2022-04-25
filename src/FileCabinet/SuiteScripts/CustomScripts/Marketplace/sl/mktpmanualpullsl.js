/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/task', 'N/ui/serverWidget'],
/**
 * @param {task} task
 * @param {serverWidget} serverWidget
 */
function(task, serverWidget) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {

    	if(context.request.method === 'GET'){
    		
    		var frm = serverWidget.createForm({
    			title: 'Manual Sync of Marketplace Record'
    		});
    		
    		var fldSelect = frm.addField({
    			id: 'custpage_fld_select',
    			type: serverWidget.FieldType.SELECT,
    			label: 'Marketplace Record'
    		});
    		
    		fldSelect.addSelectOption({
                value: '0',
                text: 'Atlassian Transaction'
            });
    		fldSelect.addSelectOption({
                value: '1',
                text: 'Atlassian Lincense'
            });
    		
    		fldSelect.isMandatory = true;
    		
    		var fldDate = frm.addField({
                id: 'custpage_fld_date',
                type: serverWidget.FieldType.DATE,
                label: 'Date'
            });
    		
    		fldDate.isMandatory = true;
    		
    		frm.addSubmitButton({label: 'Execute'});
    		
    		context.response.writePage(frm);
    	}
    	else{
    		
            var request = context.request;
            var sMRType = request.parameters.custpage_fld_select;
            var dDate = request.parameters.custpage_fld_date;
    		
            log.audit({ title: 'Manual', details: 'logs: ' + sMRType});
            log.audit({ title: 'Manual', details: 'logs: ' + dDate});
            
            
            if(sMRType == 0){
            	
            	var tskMapRed = task.create({
            	    taskType: task.TaskType.MAP_REDUCE,
            	    scriptId: 'customscript_atlassion_pull_mr',
            	    deploymentId: 'customdeploy_atlassion_manualpull_mr',
            	    params: {
            	        'custscript_atlassian_lastupdate' : dDate
            	    }
            	});	
            	
            	var id = tskMapRed.submit();
            }
            else if(sMRType == 1){
            	
            	var tskMapRed = task.create({
            	    taskType: task.TaskType.MAP_REDUCE,
            	    scriptId: 'customscript_atlassian_lic_pull_mr',
            	    deploymentId: 'customdeploy_atl_manuallicensepull_mr',
            	    params: {
            	        'custscript_atlaslic_lastupdate' : dDate
            	    }
            	});	
            	
            	var id = tskMapRed.submit();
            }
            
    		var frm = serverWidget.createForm({
    			title: 'Manual Sync of Marketplace Record'
    		});
    		
    		var fldSelect = frm.addField({
    			id: 'custpage_fld_select',
    			type: serverWidget.FieldType.SELECT,
    			label: 'Marketplace Record'
    		});
    		
    		fldSelect.addSelectOption({
                value: '0',
                text: 'Atlassian Transaction'
            });
    		fldSelect.addSelectOption({
                value: '1',
                text: 'Atlassian Lincense'
            });
    		
    		fldSelect.isMandatory = true;
    		
    		var fldDate = frm.addField({
                id: 'custpage_fld_label',
                type: serverWidget.FieldType.LABEL,
                label: 'Script is now executing. It may take a while.'
            });
    		
    		var fldDate = frm.addField({
                id: 'custpage_fld_date',
                type: serverWidget.FieldType.DATE,
                label: 'Date'
            });
    		
    		fldDate.isMandatory = true;

    		frm.addSubmitButton({label: 'Sync'});
    		
    		context.response.writePage(frm);
    	}
    }

    return {
        onRequest: onRequest
    };
    
});
