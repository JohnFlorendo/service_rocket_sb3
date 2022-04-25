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

		var altSearch = search.load({id:  'customsearch_atl_tx_hspush'});
      	//var altSearch = search.load({id:  'customsearch_contact_empty_hubid'});
		var altResults = getAllResults(altSearch);
		var objInputs = [];
		
		altResults.forEach(function(result) {
			objInputs.push({
				'id' 		: result.id
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
		log.audit({ title: 'reduce', details: 'Atlassian Contact Edit & Saving: ' + id});
    	
    	var rec = record.load({type: 'customrecord_atl_marketplace_transaction', id: id, isDynamic: true});
      	//var rec = record.load({type: 'contact', id: id, isDynamic: true});
		var id = rec.save();
    }

    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    summarize = function (summary) {
    	
    	var idDeploy = runtime.getCurrentScript().getParameter({name: 'custscript_atlassian_deploy_internalid'});
        var errorMsg = [];
        var inputSummary = summary.inputSummary;
        var mapSummary = summary.mapSummary;
        var reduceSummary = summary.reduceSummary;
        
        if(summary.inputSummary.error){
            var msg = 'Error was: ' + summary.inputSummary.error + '\n';
            errorMsg.push(msg);
        }
        
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
        
        if(errorMsg.length > 0){
	       	 sMessage =  'Error on pushing Atlassian Transaction to HS.: ' + JSON.stringify(errorMsg);
	       }
	       else{
	       	sMessage = 'Successful';
	       }

        var recLog = record.create({type: 'customrecord_atlassian_summary', isDynamic: true});
	        recLog.setValue({fieldId: 'custrecord_atlassum_message', value: sMessage});
	        recLog.setValue({fieldId: 'custrecord_atlassum_numprocessed', value: parseInt(nProcessed) + parseInt(nErrored)});
	        recLog.setValue({fieldId: 'custrecord_atlassum_error', value: nErrored});
        var id = recLog.save();
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
