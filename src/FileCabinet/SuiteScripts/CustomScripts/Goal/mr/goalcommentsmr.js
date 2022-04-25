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
			query: "SELECT goal.id FROM goal WHERE  lastmodifieddate BETWEEN BUILTIN.RELATIVE_RANGES('DAGO3', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('TODAY', 'END', 'DATE') ORDER by goal.id"
		}).asMappedResults();

        log.audit({
            title: 'getInputData',
            details: 'arrInput data: ' + JSON.stringify(arrInput)
        });
		
        for (var index in arrInput) {
        	arrInput[index].key = arrInput[index].id;
        }
        
//        log.audit({
//            title: 'getInputData',
//            details: 'arrInput: ' + arrInput.length
//        });

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
      
        var recGoal = record.load({
        	type: 'goal',
        	id: reduceData.id
        });
        
        for (var nLine = 0; nLine < recGoal.getLineCount({sublistId: 'goalcomments'}); nLine++) {
		
			var recComment;
			
			var arrComments = query.runSuiteQL({
				query: 'SELECT id FROM customrecord_goalcomments WHERE externalid = ' + recGoal.getSublistValue({
					sublistId:'goalcomments', 
					fieldId: 'id', 
					line : nLine})
			}).asMappedResults();
			
			
			if(arrComments.length > 0){
				
				recComment = record.load({
					type: 'customrecord_goalcomments',
					id: arrComments[0].id,
					isDynamic: true
				});
			}
			else{
				recComment = record.create({
					type: 'customrecord_goalcomments',
					isDynamic: true
				});	
			}
			
			recComment.setValue({
				fieldId: 'custrecord_gc_goal',
				value: reduceData.id
			});
			
			recComment.setValue({
				fieldId: 'externalid',
				value: recGoal.getSublistValue({
					sublistId:'goalcomments', 
					fieldId: 'id', 
					line : nLine})
			});
			
			recComment.setValue({
				fieldId: 'custrecord_gc_employee',
				value: recGoal.getSublistValue({
					sublistId:'goalcomments', 
					fieldId: 'createdby', 
					line : nLine})
			});
			
			recComment.setValue({
				fieldId: 'custrecord_gc_date',
				value: recGoal.getSublistValue({
					sublistId:'goalcomments', 
					fieldId: 'createddate', 
					line : nLine})
			});
			
			recComment.setValue({
				fieldId: 'custrecord_gc_comments',
				value: recGoal.getSublistValue({
					sublistId:'goalcomments', 
					fieldId: 'goalcomment', 
					line : nLine})
			});
			
			var id = recComment.save();
		}
     
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
