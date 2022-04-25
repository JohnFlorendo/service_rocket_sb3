/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/record', 'N/file', 'N/url', 'N/ui/serverWidget', '../api/jobrequisition', '../api/lib/jobrequisitionposting'],

function(runtime, record, file, url, serverWidget, jobrequisition, jobrequisitionposting) {

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(scriptContext) {

    	if(scriptContext.type == 'view'){
    		
    		var form = scriptContext.form;
    		var newRec = scriptContext.newRecord;
			var html = file.load({id: 165541}).getContents();//btnhtml.html
			var insertHml = form.addField({ id: 'custpage_pa_jquery1', type: serverWidget.FieldType.INLINEHTML, label: 'JQ'});
			
			//Sync Lever
			var sURL = url.resolveScript({ scriptId: 'customscript_sync_lever_sl', deploymentId: 'customdeploy_sync_lever_sl'});
			sURL = sURL + '&jobrequisition=' + newRec.id;
			html = html.replace('{surl1}', sURL);
			html = html.replace('{leverid}', newRec.getValue('custrecord_jr_leverid'));
			
			insertHml.defaultValue = html;
			form.addButton({id : 'custpage_btn_synclever', label : 'Sync Lever', functionName: 'popSync' });
			
			if(newRec.getValue('custrecord_jr_leverid') != ''){
				form.addButton({id : 'custpage_btn_openjr', label : 'Open in Lever', functionName: 'openLeverRequisiton' });	
			}
    	}
    	
    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext) {

    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(scriptContext) {

    	
    	var newRec = scriptContext.newRecord;
    	var result;
    	
    	if(runtime.executionContext !== runtime.ContextType.USERINTERFACE){
    		
    		newRec = record.load({
    		    type: newRec.type,
    		    id: newRec.id,
    		    isDynamic: true

    		});
    		
			try {
				
				result = jobrequisition.syncLever({
					record : newRec,
					context : scriptContext
				});
				
				var id = result.record.save();
			} 
			catch (err) {
				
	    		log.audit({
			        title: 'afterSubmit',
			        details: 'Error: ' + err
			    });
			}
    	}
    }

    return {
    	beforeLoad: beforeLoad,
        afterSubmit: afterSubmit
    };
    
});
