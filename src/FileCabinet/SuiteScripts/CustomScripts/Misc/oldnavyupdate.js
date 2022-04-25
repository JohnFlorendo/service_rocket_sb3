/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],
/**
 * @param {record} record
 * @param {search} search
 */
function(record, search) {
   
    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} scriptContext
     * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
     * @Since 2015.2
     */
    function execute(scriptContext) {
    	
    	var src = search.load({id: 'customsearch13559'});
    	
    	src.run().each(function(result) {
    		
    		
            var id = result.getValue({
                name: 'internalid', summary : search.Summary.GROUP
            });

            var bSave = false;
            
            var recEstimate = record.load({type: 'estimate', id: id, isDynamic: true});
            
            var idDcHeader = recEstimate.getValue({fieldId: 'discountitem'});
            var nDcHeader = recEstimate.getValue({fieldId: 'discountrate'});
            
            if(idDcHeader == 6329){
            	recEstimate.setValue({fieldId: 'discountitem', value : 6443});
            	recEstimate.setValue({fieldId: 'discountrate', value : nDcHeader});
            	bSave = true;
            }
            
            
            for (var nLine = 0; nLine < recEstimate.getLineCount({sublistId: 'item' }); nLine++) {
				
            	recEstimate.selectLine({sublistId: 'item', line : nLine });
            	
            	if(recEstimate.getCurrentSublistValue({sublistId: 'item', fieldId: 'item', line: nLine}) == 6329){
            		
            		var sDesc = recEstimate.getCurrentSublistValue({sublistId: 'item', fieldId: 'description', line: nLine});
            		var nRate = recEstimate.getCurrentSublistValue({sublistId: 'item', fieldId: 'rate', line: nLine});
            		var nUsdRate = recEstimate.getCurrentSublistValue({sublistId: 'item', fieldId: 'custcol_atl_usdrate', line: nLine});
            		var bNavyDc = recEstimate.getCurrentSublistValue({sublistId: 'item', fieldId: 'custcol_nvy_atl_discount', line: nLine});
            		
            		recEstimate.setCurrentSublistValue({sublistId: 'item', fieldId: 'item', value: 6443, ignoreFieldChange: false});
            		recEstimate.setCurrentSublistValue({sublistId: 'item', fieldId: 'price', value: -1, ignoreFieldChange: true});
            		recEstimate.setCurrentSublistValue({sublistId: 'item', fieldId: 'rate', value: nRate, ignoreFieldChange: false});
            		recEstimate.setCurrentSublistValue({sublistId: 'item', fieldId: 'custcol_atl_usdrate', value: nUsdRate, ignoreFieldChange: false});
            		recEstimate.setCurrentSublistValue({sublistId: 'item', fieldId: 'description', value: sDesc, ignoreFieldChange: true});
            		recEstimate.setCurrentSublistValue({sublistId: 'item', fieldId: 'custcol_nvy_atl_discount', value: true, ignoreFieldChange: true});
            		recEstimate.commitLine({sublistId: 'item'});
            		
            		
            		bSave = true;
            	}
			}
            
            
            if(bSave){
            	var id = recEstimate.save({ignoreMandatoryFields: true});	
            }
            
            var x =1;
            return true;
        });
    	
    	
    	
    	
    	
    }

    return {
        execute: execute
    };
    
});
