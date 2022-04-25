/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/url', '../api/function'],

function(runtime, url, _function) {
   
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
    	
//        var newRec = scriptContext.newRecord;
//        
//        if (scriptContext.type == scriptContext.UserEventType.VIEW){
//        	
//            var form = scriptContext.form;
//            
//            var urlLink = url.resolveScript({
//                scriptId: 'customscript_functionally_sl',
//                deploymentId: 'customdeploy_functionally_sl',
//                returnExternalUrl: false
//            });
//            
//            urlLink += '&functionid='+newRec.id;
//            
//            var stOnCall = "window.open('" + urlLink+ "')" ;
//            
//            form.addButton({
//                id : 'custpage_btn',
//                label : 'Open Function w/ Activities',
//                functionName : stOnCall
//            });
//        	
//        	
//        }
            

    	
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
    	
    	if(runtime.executionContext !== runtime.ContextType.USERINTERFACE){
    		
    		if(scriptContext.type == scriptContext.UserEventType.CREATE ||
        			scriptContext.type == scriptContext.UserEventType.EDIT){
    			_function.updateFuncMapFields(newRec);
        	}	
    	}
    }

    return {
    	afterSubmit: afterSubmit
    };
    
});
