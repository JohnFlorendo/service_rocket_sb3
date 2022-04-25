/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/https', '../api/lever'],
/**
 * @param {https} https
 */
function(https, lever) {
   
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
    	
//    	var arrNew = lever.getOpportunity({parameter: '?stage_id=offer'}).result.data;
//    	arrNew = arrNew.map(function(map) {return {id: map.id, stage: 'new'};});
    	
    	var arrNew = lever.getOpportunity({
    	    parameter: '?stage_id=offer&tag=NetSuite Offered'
    	}).result.data;
    	
    	arrNew = arrNew.map(function (map) {
    	    return {
    	        id: map.id,
    	        stage: 'new'
    	    };
    	});

    	var arrUpdate = lever.getOpportunity({
    	    parameter: '?stage_id=offer&tag=NetSuite Synching'
    	}).result.data;
    	
    	arrUpdate = arrUpdate.map(function (map) {
    	    return {
    	        id: map.id,
    	        stage: 'update'
    	    };
    	});

    	
    	var arrInputs = arrNew.concat(arrUpdate);
    	
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
	
    	var objContext = JSON.parse(context.value);
        
        log.audit({
            title: 'map',
            details: context.value
        });
        
        var mapKey = objContext.id;
        var mapValue = objContext;
        
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
    	
        var objContext = JSON.parse(context.values[0]);
        var reduceData = objContext;
        var result;
        
        log.audit({
            title: 'reduce',
            details: context.values[0]
        });
        
        
        
    	if(reduceData.stage == 'new'){
    		
            log.audit({
                title: 'reduceData',
                details: 'new reduceData: ' + reduceData.id
            });
            
            result = lever.createOffer(reduceData);
    		
    	}
    	else if(reduceData.stage == 'update'){
    		
            log.audit({
                title: 'reduceData',
                details: 'update reduceData: ' + reduceData.id
            });
            
            result = lever.updateOffer(reduceData);
    		
    	}
    	
        log.audit({
            title: 'reduce',
            details: 'result: ' + JSON.stringify(result)
        });
    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {

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
