/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],
/**
 * @param {record} record
 * @param {search} search
 */
function(record, search) {
   
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
    	
		var altSearch = search.load({id: 'customsearch13560'});
		var altResults = getAllResults(altSearch);
		var objInputs = [];

		log.audit({ title: 'getInputData', details: 'altResults.length: ' + altResults.length});
		
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
    function reduce(context) {
    	
    	var id = context.key;
    	
    	log.audit({ title: 'reduce', details: 'id: ' + id});
    	log.audit({ title: 'reduce', details: 'old externalid: ' + rec.getValue({fieldId: 'externalid'})});
    	
    	var rec = record.load({type: 'customrecord_atl_marketplace_license', id: id, isDynamic: true});
    		rec.setValue({fieldId: 'externalid', value : rec.getValue({fieldId:'custrecord_lic_license_id'}) + '-' + rec.getValue({fieldId:'custrecord_lic_addon_license_id'})});
    		
    		log.audit({ title: 'reduce', details: 'new externalid: ' + rec.getValue({fieldId: 'externalid'})});
    	var id = rec.save();
    	
    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {

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
