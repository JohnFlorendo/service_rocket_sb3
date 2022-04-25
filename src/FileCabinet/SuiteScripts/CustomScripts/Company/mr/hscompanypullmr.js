/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['../../NetSpot/api/netspot'],

function(netspot) {
   
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
	getInputData = function () {
    	
		var arrInput = [];
    	var objDeals = netspot.search().data;
    	
    	if(objDeals.result.status == 'SUCESS'){
    		arrInput = objDeals.result.data
    	}

    	return arrInput
    	
    };

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	
    	var objContext = JSON.parse(context.value); 
    	var keyMap = objContext.key;

    	var objContent = {};
    		objContent.value = [];
    		objContent.text = [];
    		objContent.date = [];

    	fldValues.forEach(function(field, indx) {
    		objContent.value.push({fieldId: field, value: objContext[field]});
		});

    	fldDate.forEach(function(field, indx) {
    		
    		var arrDate  = objContext[field].split('-');
    			sDate = arrDate[1] + '/' + arrDate[2] + '/' + arrDate[0];
    		objContent.date.push({fieldId: field, value: sDate});
		});
    	
    	fldTxt.forEach(function(field, indx) {
    		objContent.text.push({fieldId: field, text: objContext[field]});
		});

        context.write({
            key: keyMap,
            value: objContent
        });
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {

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
