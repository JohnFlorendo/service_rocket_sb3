/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/file', 'N/query', '../api/coda'],
/**
 * @param {file} file
 * @param {query} query
 */
function(file, query, coda) {
   
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

		var sSql = file.load({
			id: 'SuiteScripts/CustomScripts/Coda/sql/goal.sql'
		}).getContents();
		
		var arrInputs = query.runSuiteQL({
			query: sSql
		}).asMappedResults();
		
		
		return arrInputs;
    };

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    map = function (context) {

    	var objContext = JSON.parse(context.value);
        var mapKey = objContext.id;
        var mapValue = objContext;
        
        context.write({
            key: mapKey,
            value: mapValue
        });
    	
    };

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    reduce = function (context) {

        var objContext = JSON.parse(context.values[0]);
        var reduceData = objContext;
        
        log.audit({
            title: 'reduce',
            details: context.values[0]
        });
        
        var id = coda.addGoal({
        	data: reduceData
        });
        
        var x = 1;
    	
    };


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    summarize = function (summary) {
    	var reduceSummary = summary.reduceSummary;
    	
        reduceSummary.errors.iterator().each(function(key, value){
            var msg = 'Process id: ' + key + '. Error was: ' + JSON.parse(value).message + '\n';
            
            log.audit({
                title: 'summarize',
                details: 'error: ' + msg
            });
            
            return true;
        });
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
