/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record'],
/**
 * @param {record} record
 */
function(record) {
   
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
        
      //update billable and non-billable hours on project record
        if(newRec.getValue({fieldId: 'approvalstatus'}) == 3){
        	
            for(var nLine=0; nLine  < newRec.getLineCount({sublistId: 'timeitem'}); nLine++) {
            	
                var idJob  = newRec.getSublistValue({	sublistId: 'timeitem', 
                										fieldId: 'customer', 
                										line: nLine});

                if(idJob != '' && idJob != null){

                	try{
	                	var recJob = record.load({type: record.Type.JOB, id: idJob, isDynamic: true});

	            		recJob.setValue({	fieldId: 'custentity_billable_hours', 
	            							value : recJob.getValue({fieldId: 'custentity_sf_billable_hours'}) || 0 });
	            		recJob.setValue({	fieldId: 'custentity_nonbillable_hours', 
	            							value : recJob.getValue({fieldId: 'custentity_sf_nonbillable_hours'}) || 0});
	            		
	            		var idJob = recJob.save();
            		}
            		catch(err){
            			log.audit({ title: 'afterSubmit', details: 'err: ' + err});
            		}
                }
            }
        }
    }

    return {
        afterSubmit: afterSubmit
    };
    
});
