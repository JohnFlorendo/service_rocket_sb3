/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime','../../Job/api/lib/hcmfmupdate'],
/**
 * @param {record} record
 */
function(record, runtime, hcmfmupdate) {
   
    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
	
	var PARAMFUNCTION = 'custscript_fm_function';
	var FUNCTION = 'customrecord_sr_function';
	var SUBJOB = 'recmachcustrecord_sr_function_job';
	var COLJOB = 'custrecord_sr_job';
	
    function getInputData() {
    	
    	var idFunction = runtime.getCurrentScript().getParameter({name: 'custscript_fm_function'});
		var recFunction = record.load({type: FUNCTION, id: idFunction});
		var arrInputs = [];
		
		for (var nLine = 0; nLine < recFunction.getLineCount({sublistId: SUBJOB}); nLine++) {
			var idJob = recFunction.getSublistValue({sublistId: SUBJOB, fieldId: COLJOB, line: nLine});
			arrInputs.push({id: idJob});
		}

    	return arrInputs;
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	
    	var objContext = JSON.parse(context.value); 
    	var idFunction = objContext.id;
    	var objValues = {};
			objValues.id = idFunction;

    	context.write({
            key: idFunction,
            value: objValues
        });
    	
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {

    	var idFunction = context.key;
    	var recHcm = record.load({type: 'hcmjob', id: idFunction, isDynamic: true});
    	recHcm = hcmfmupdate.updateFuncMapFields(recHcm);
    	var id = recHcm.save();
    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {
    	
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
