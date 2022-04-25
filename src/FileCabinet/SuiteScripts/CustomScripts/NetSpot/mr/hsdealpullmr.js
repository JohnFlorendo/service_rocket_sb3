/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['../api/netspot', '../../Deal/api/deal', '../../Library/momentjs/moment'],

function(netspot, deal, moment) {
   
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
		
		
		var objPayload = {
				"filterGroups": [{
					"filters": [{
						"propertyName": "dealname",
						"operator": "HAS_PROPERTY"
					}, {
						"propertyName": "createdate",
						"operator": "GTE",
						"value": (moment().subtract(1, 'days')).valueOf()
					}],
					"filters": [{
						"propertyName": "hs_lastmodifieddate",
						"operator": "GTE",
						"value": (moment().subtract(1, 'days')).valueOf()
					}]
				}],
					
				"sorts": ["createdate"],
				"properties": ["dealname", "dealstage", "pipeline",
					"nsclass", "amount", "deal_currency_code",
					"hubspot_owner_id", "nsid", "closedate"],
				limit: 100,
				after: 0

			};
		
		
    	var objDeals = netspot.searchDeal({
    		request: objPayload
    	});
    	
    	if(objDeals.result.status == 'SUCCESS'){
    		arrInput = objDeals.result.data;
    	}
    	
        for (var index in arrInput) {
        	arrInput[index].key = arrInput[index].id;
        }
    	
        log.audit({
            title: 'getInputData',
            details: 'arrInput: ' + arrInput.length
        });
        
    	return arrInput;
    	
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
        
        var nsptDeal = netspot.getDeal({id: reduceData.id });
        var objDeal = {};
        
        if(nsptDeal.result.status == 'SUCCESS'){
        	
        	objDeal = nsptDeal.result.data;
        }
        
        if(objDeal.associations){
        	
        	reduceData.properties.customerid = objDeal.associations.companies.results[0].id; 
        	
        	var nsptCompany = netspot.getCompany({
        		id: reduceData.properties.customerid, 
        		properties: ['nsid', 'name']	
        	});
        	var objCompany = {};
        	
            if(nsptCompany.result.status == 'SUCCESS'){
            	objCompany = nsptCompany.result.data;
            	reduceData.properties.customer = objCompany.properties.name;
            }
        	
        }
        
        var id = deal.createHsDeal(reduceData);
        
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
                details: 'summarize: ' + msg
            });
            
            return true;
        });
    };

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
