/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * Originally Deployed on 24 Feb 2021
 */
define(['../api/expensereport'],

function(expensereport) {
   
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
    	
    	//***24 Feb 2021 ITSM-1582
    	if( newRec.getValue({fieldId: 'subsidiary'})== 15){
    		
    	    var newRec = scriptContext.newRecord;
    	    var oldRec = scriptContext.oldRecord;
    		
    		if(scriptContext.type == 'approve'){
    			expensereport.uploadExpenseReport(newRec);	
    		}
    		else if(scriptContext.type == 'edit'){
    			
        		if(oldRec.getValue({fieldId: 'accountingapproval'}) == false &&
        				newRec.getValue({fieldId: 'accountingapproval'}) == true){
        			
        			try{
        				expensereport.uploadExpenseReport(newRec);
        			}
        			catch(err){
        				log.audit('afterSubmit', err);
        			}
        		}
    		}
    	}
    	//***
    }

    return {
        afterSubmit: afterSubmit
    };
    
});
