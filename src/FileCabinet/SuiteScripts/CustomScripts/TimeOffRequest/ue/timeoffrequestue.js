/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['../../SuiteGoogle/api/gsuite'],

function(gsuite) {
   
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
    	var resCalendar;
    	
        log.audit({
            title: 'afterSubmit',
            details: 'type: ' + scriptContext.type
        });
    	
    	if( scriptContext.type == scriptContext.UserEventType.CREATE){
    		
    		resCalendar = gsuite.createCalendar({
    			type: newRec.type,
    			id: newRec.id
    		});
    		
    	}
    	else if( scriptContext.type == scriptContext.UserEventType.EDIT){

	        log.audit({
	            title: 'afterSubmit',
	            details: 'google id: ' + newRec.getValue({
	    			fieldId:'custrecord_googleeventid' 
	    		})
	        });
			
			resCalendar = gsuite.updateCalendar({
    			type: newRec.type,
    			id: newRec.id
    		});
    		
    		
//    		if(newRec.getValue({
//    			fieldId:'custrecord_googleeventid' 
//    		})){
//    			
//    	        log.audit({
//    	            title: 'afterSubmit',
//    	            details: 'google id: ' + newRec.getValue({
//    	    			fieldId:'custrecord_googleeventid' 
//    	    		})
//    	        });
//    			
//    			resCalendar = gsuite.updateCalendar({
//        			type: newRec.type,
//        			id: newRec.id
//        		});
//    		}
//    		else{
//    		
//        		resCalendar = gsuite.createCalendar({
//        			type: newRec.type,
//        			id: newRec.id
//        		});
//    			
//    		}
    		
    		var x =1;
    	}
    	
    };

    return {
        //beforeLoad: beforeLoad,
        //beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
