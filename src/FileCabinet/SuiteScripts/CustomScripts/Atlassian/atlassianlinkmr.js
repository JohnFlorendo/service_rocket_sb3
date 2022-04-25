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
    	
    	var idSrc = runtime.getCurrentScript().getParameter({name: 'custscript_atlasian_search'});
		var altSearch = search.load({id:  idSrc});
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
   	
    	/////Linking Starts Here
    	    	
    	log.audit({ title: 'reduce', details: 'Atlassian Transaction Saved: ' + id});
    	
    	var rec = record.load({type: 'customrecord_atl_marketplace_transaction', id: id, isDynamic: true});
    	
    	//checking of matrix key
		var src = search.create({type: 'item', columns: ['internalid']});
    		src.filters = [];
    		src.filters.push(search.createFilter({name: 'custitem_addon_key', operator: 'is', values: rec.getValue({fieldId: 'custrecord_addon_key'})}));
    		src.filters.push(search.createFilter({name: 'custitem_matrix_license_type', operator: 'is', values: rec.getValue({fieldId: 'custrecord_mtx_license_type'})}));
    		src.filters.push(search.createFilter({name: 'custitem_matrix_sale_type', operator: 'is', values: rec.getValue({fieldId: 'custrecord_mtx_sale_type'})}));
    		src.filters.push(search.createFilter({name: 'custitem_matrix_hosting', operator: 'is', values: rec.getValue({fieldId: 'custrecord_mtx_hosting'})}));
		
    	var res = src.run().getRange({start: 0, end: 1});
    	
    	if(res.length > 0){
    		rec.setValue({fieldId: 'custrecord_item', value: res[0].id});
			var id = rec.save();
    	}
    	else{
    		//error for missing addon key
    		
            var errAtlassian = error.create({
                name: 'ITEM_COMBINATION_NOT_FOUND',
                message: rec.getValue({fieldId: 'custrecord_transaction_id'}) + '|' + rec.getValue({fieldId: 'custrecord_license_id'}) +' - Missing Combination for addon key: ' + rec.getValue({fieldId: 'custrecord_addon_key'}) + ' ('+ rec.getText({fieldId: 'custrecord_mtx_license_type'}) + 
                ', ' + rec.getText({fieldId: 'custrecord_mtx_sale_type'}) +', ' + rec.getText({fieldId: 'custrecord_mtx_hosting'}) +', ' + rec.getText({fieldId: 'custrecord_mtx_billing_period'})  +')' ,
                notifyOff: false
            });

            throw errAtlassian;
    	}
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
        
        //var recDeploy = record.load({type: 'scriptdeployment', id: idDeploy});
        //var nOffset = recDeploy.getValue({fieldId: 'custscript_atlassian_offset'});
        
        //log.audit({ title: 'summarize', details: 'offset: ' + nOffset});
        
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
	       	 sMessage =  'Error on importing Atlassian Transaction.  Please visit this article in TSM for details (https://rocketeers.atlassian.net/l/c/FhNAcJwj): ' + JSON.stringify(errorMsg);
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
