/**
 * @NApiVersion 2.0
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/runtime', '../api/chargebee'],

	/**
	 * @param {record} record
	 * @param {runtime} runtime
     * custom modules
     * @param {chargebee} chargebee
     */
		
    function (record, runtime, chargebee) {

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
	
	var SUBSCRIPTION = 3;
	var INVOICE = 4;
	
	
    function getInputData() {
   	
    	var arrInputs;
    	var idType = runtime.getCurrentScript().getParameter({
            name: 'custscript_cb_type'
        });
    	
    	
    	if(idType == SUBSCRIPTION){
    		arrInputs = chargebee.getLicenses();
    	}
    	else if(idType == INVOICE){
    		arrInputs = chargebee.getInvoices();
    	}

        log.audit({
            title: 'getInputData',
            details: 'arrInputs length: ' + arrInputs.length
        });

        return arrInputs;

    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {

    	var idType = runtime.getCurrentScript().getParameter({
            name: 'custscript_cb_type'
        });
   	
        var objContext = JSON.parse(context.value);
        var mapKey;
        var mapValue = objContext;

    	if(idType == SUBSCRIPTION){
    		mapKey = objContext.subscription.id;
    	}
    	else if(idType == INVOICE){
    		mapKey = objContext.invoice.id;
    	}
        
        
        context.write({
            key: mapKey,
            value: mapValue
        });

    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {

    	var idType = runtime.getCurrentScript().getParameter({
            name: 'custscript_cb_type'
        });
        
        var objContext = JSON.parse(context.values[0]);
        var reduceData = objContext;
        
    	if(idType == SUBSCRIPTION){
    		var id = chargebee.createLicense(reduceData);
    	}
    	else if(idType == INVOICE){
    		var id = chargebee.createInvoice(reduceData);
    	}
    }

    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {

        var inputSummary = summary.inputSummary;
        var mapSummary = summary.mapSummary;
        var reduceSummary = summary.reduceSummary;
        var errorMsg = [];
        var nProcessed = 0;
        var nErrored = 0;
        
        reduceSummary.keys.iterator().each(function (key, executionCount, completionState){
        	
	        if (completionState === 'COMPLETE'){
	        	nProcessed++;
	        }
	        else if (completionState === 'FAILED'){
	        	nErrored++;
	        }
	        return true;

        });
        
        reduceSummary.errors.iterator().each(function(key, value){
            var msg = 'Process id: ' + key + '. Error was: ' + JSON.parse(value).message + '\n';
            errorMsg.push(msg);
            return true;
        });
        
        var sMessage = '';
        
        if (errorMsg.length > 0) {
            sMessage = 'Error on Chargebee Integration: ' + JSON.stringify(errorMsg);
        } else {
            sMessage = 'Successful';
        }

        var recLog = record.create({
            type: 'customrecord_atlassian_summary',
            isDynamic: true
        });
        recLog.setValue({
            fieldId: 'custrecord_atlassum_message',
            value: sMessage
        });
        recLog.setValue({
            fieldId: 'custrecord_atlassum_numprocessed',
            value: parseInt(nProcessed) + parseInt(nErrored)
        });
        recLog.setValue({
            fieldId: 'custrecord_atlassum_error',
            value: nErrored
        });
        
        var id = recLog.save();
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };

});