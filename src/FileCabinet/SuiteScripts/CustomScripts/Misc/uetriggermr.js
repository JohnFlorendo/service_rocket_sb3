/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/https', 'N/encode', 'N/record', 'N/format', 'N/search', 'N/runtime', 'N/error'],
/**
 * @param {https} https
 * @param {encode} encode
 * @param {record} record
 */
function(https, encode, record, format, search, runtime, error) {
   
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
	
    function getInputData() {

    	var idSrc = runtime.getCurrentScript().getParameter({name: 'custscript_search_record'});
		var altSearch = search.load({id:  idSrc});
		var altResults = getAllResults(altSearch);
		var objInputs = [];
		
		altResults.forEach(function(result) {
			objInputs.push({
				'id' 		: result.id,
				'type'		: result.recordType
			});
		    return true;
		});

		
		log.audit({ title: 'getInputData', details: 'JSON: ' + JSON.stringify(objInputs)});
		
    	return objInputs;
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	
    	var objContext = JSON.parse(context.value); 
    	var idAlt = objContext.id
    	var objValues = {};
			objValues.id = objContext.idAlt;
			objValues.type = objContext.type;

    	context.write({
            key: idAlt,
            value: objValues
        });
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    reduce = function (context) {

		var id = context.key;
		var aValue = JSON.parse(context.values[0]);
		var rec = record.load({type: aValue.type, id: id, isDynamic: true});
		var id = rec.save();
    }

    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    summarize = function (summary) {
    	
        var errorMsg = [];
        var reduceSummary = summary.reduceSummary;
        
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
            
            log.audit({ title: 'summarize', details: msg});

            return true;
        });
    }

    function getAllResults(s) {
        var results = s.run();
        var searchResults = [];
        var searchid = 0;
        do {
            var resultslice = results.getRange({start:searchid,end:searchid+1000});
            resultslice.forEach(function(slice) {
                searchResults.push(slice);
                searchid++;
                }
            );
        } while (resultslice.length >=1000);
        return searchResults;
    } 
    
    return {

        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
