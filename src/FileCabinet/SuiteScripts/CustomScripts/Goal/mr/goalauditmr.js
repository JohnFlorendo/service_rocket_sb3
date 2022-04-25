/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/query', 'N/record'],
/**
 * @param {record} record
 * @param {query} query
 */
function(query, record) {
   
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
    	
		var arrInput = query.runSuiteQL({
			query: 'SELECT goal.id AS id, goal.employee AS employee FROM goal WHERE goal.id > 10 ORDER by goal.id '
		}).asMappedResults();

        for (var index in arrInput) {
        	arrInput[index].key = arrInput[index].id;
        }
		
        return arrInput; 
		
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {

        var objContext = JSON.parse(context.value);
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
     
		var recAudit;
		
		var arrAudit = query.runSuiteQL({
			query: 'SELECT id FROM customrecord_sr_goal_stf_audit WHERE externalid = ' + reduceData.id
		}).asMappedResults();
		
		
		if(arrAudit.length > 0){
			
			recAudit = record.load({
				type: 'customrecord_sr_goal_stf_audit',
				id: arrAudit[0].id,
				isDynamic: true
			});
		}
		else{
			recAudit = record.create({
				type: 'customrecord_sr_goal_stf_audit',
				isDynamic: true
			});	
		}
		
		recAudit.setValue({
			fieldId: 'externalid',
			value: reduceData.id
		});
		
		recAudit.setValue({
			fieldId: 'custrecord_sr_stf_audit_rocketeer',
			value: reduceData.employee
		});
		
		recAudit.setValue({
			fieldId: 'custrecord_sr_stf_audit_cycle',
			value: 1
		});
		
		recAudit.setValue({
			fieldId: 'custrecord_sr_stf_audit_points',
			value: 10
		});
		
		recAudit.setValue({
			fieldId: 'custrecord_sr_stf_audit_status',
			value: 4
		});
		
		recAudit.setValue({
			fieldId: 'custrecord_sr_stf_audit_goal',
			value: reduceData.id
		});
		
		var id = recAudit.save();
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
                details: 'summarize: ' + msg
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
