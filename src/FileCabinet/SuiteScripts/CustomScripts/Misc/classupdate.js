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
	
	var P1 = 85; //Professional Services
	var M1 = 86; //Managed Services
	var R1 = 90; //Resell
	var A1 = 87; //Apps
	var L1 = 88; //Learndot
	var O1 = 89; //Operations
	
	var objClassMap = {
			'85' : P1, //Professional Services
			'86' : M1, //Managed Services
			'91' : R1, //Resell
			'87' : A1, //Apps
			'88' : L1, //Learndot
			'89' : O1, //Operations
			'47' : P1, //Blue
			'55' : P1, //ATL - Atlassian Services
			'74' : P1, //ATL - Integration Services
			'57' : M1, //ATL - Support
			'76' : P1, //Atlassian
			'58' : P1, //Atlassian - ENT Curriculum Dev
			'66' : P1, //Atlassian - ENT Offerings
			'56' : P1, //Atlassian - ENT Training
			'65' : P1, //Atlassian - Enterprise
			'67' : P1, //eLearning
			'59' : R1, //Navy Blue
			'49' : M1, //Teal
			'50' : M1, //XST - Atlassian
			'51' : M1, //XST - Docker
			'77' : M1, //XST - Mattermost
			'73' : A1, //Green
			'75' : A1, //Apps
			'42' : A1, //Lime
			'78' : A1, //Mint
			'41' : A1, //Olive
			'43' : A1, //Violet
			'40' : L1, //Orange
			'62' : L1, //Apps:Learndot - Apps
			'46' : L1, //Apps:Learndot - Curriculum Dev
			'60' : L1, //Apps:Learndot - Support
			'45' : L1, //Learndot - Services
			'44' : L1, //Learndot - Subscription
			'61' : L1, //Learndot - Training Services
			'48' : P1, //Purple
			'52' : P1, //Facebook - WP Consulting Srvs
			'54' : P1, //Facebook - WP Curriculum Dev
			'63' : P1, //Facebook - WP Subscription Srvs
			'53' : P1, //Facebook - WP Training
			'5' : O1, //BlackWhite
	}
	
	//BU
//	var P1 = 7; //Professional Services
//	var M1 = 8; //Managed Services
//	var R1 = 11; //Resell
//	var A1 = 9; //Apps
//	var L1 = 10; //Learndot
//	var O1 = 12; //Operations
//
//	var objBusinessUnit = {
//			'1': P1, //Blue
//			'2': A1, //Green
//			'3': P1, //Purple
//			'4': M1, //Teal
//			'5': L1, //Orange
//			'6': O1, //Orange
//			
//	}
	
	
    function getInputData() {
  	
    	return {
    		type: 'search',
    		id: 13573
    	}
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	
    	 context.write({
             key: context.key,
             value: JSON.parse(context.value)
         });
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {
    	
    	//log.audit({ title: 'reduce', details: 'reduce: ' + JSON.stringify(context)});
    	
    	var id = context.key;
    	var objValues = context.values;
  	
    	//var newHardClass = L1;
    	

		var rec = record.load({
			type : record.Type.SALES_ORDER,
			id : id,
			isDynamic : true
		});
//    	var oldBu = rec.getValue({fieldId: 'custentity4'});
//    	var newBu = objBusinessUnit[oldBu];
//    	
//    	rec.setValue({fieldId: 'custentity4', value: newBu});
    	

		var oldClass = rec.getValue({
			fieldId : 'class'
		});
		var newClass = objClassMap[oldClass];
    	var newClass = R1;
    	

		rec.setValue({
			fieldId : 'class',
			value : newClass
		});
		
//		rec.setValue({
//			fieldId : 'custbody_end_user',
//			value : rec.getValue({
//				fieldId : 'entity'
//			})
//		});
    		
    		
    	
    		for ( var key in objValues) {
    			
    			var objValue = JSON.parse(objValues[key]);
    			    			
        		for (var nLine = 0; nLine < rec.getLineCount({sublistId: 'item'}); nLine++) {
      			
        			rec.selectLine({
        			    sublistId: 'item',
        			    line: nLine
        			});
        			
        			if( rec.getCurrentSublistValue({
    			    			    sublistId: 'item',
    			    			    fieldId: 'lineuniquekey',
    			    			    line: nLine
    			    			}) == objValue.values.lineuniquekey){
        				
            			oldClass = rec.getCurrentSublistValue({
		    			    sublistId: 'item',
		    			    fieldId: 'class',
		    			    line: nLine
		    			});
			
						//newClass = objClassMap[oldClass];
						//newClass = L1;
						
						//log.audit({ title: 'reduce', details: 'newClass: ' + newClass});
						
						rec.setCurrentSublistValue({
						    sublistId: 'item',
						    fieldId: 'class',
						    value: newClass
						});
						
						rec.commitLine({
						    sublistId: 'item'
						});
						
						break;
        			}
    			}
			}
    		
    		for (var nLine = 0; nLine < rec.getLineCount({sublistId: 'expense'}); nLine++) {
    			
    			
    			rec.selectLine({
    			    sublistId: 'expense',
    			    line: nLine
    			});
    			
    			if( rec.getCurrentSublistValue({
			    			    sublistId: 'expense',
			    			    fieldId: 'lineuniquekey',
			    			    line: nLine
			    			}) == objValue.values.lineuniquekey){
		
					oldClass = rec.getCurrentSublistValue({
					    sublistId: 'expense',
					    fieldId: 'class',
					    line: nLine
					});
			
					//newClass = objClassMap[oldClass];
					//newClass = L1;
					//log.audit({ title: 'reduce', details: 'newClass: ' + newClass});
					
					rec.setCurrentSublistValue({
					    sublistId: 'expense',
					    fieldId: 'class',
					    value: newClass
					});
					
					rec.commitLine({
					    sublistId: 'expense'
					});
					
					break;
				}
			}
    		
    		for (var nLine = 0; nLine < rec.getLineCount({sublistId: 'line'}); nLine++) {
    			
    			
    			rec.selectLine({
    			    sublistId: 'line',
    			    line: nLine
    			})
    			
    			oldClass = rec.getCurrentSublistValue({
			    			    sublistId: 'line',
			    			    fieldId: 'class',
			    			    line: nLine
			    			});
    			
    			//newClass = objClassMap[oldClass];
    			//newClass = L1;
    			
    			
    			rec.setCurrentSublistValue({
    			    sublistId: 'line',
    			    fieldId: 'class',
    			    value: newClass
    			});
    			
    			rec.commitLine({
    			    sublistId: 'line'
    			});
			}
    		
    		log.audit({ title: 'reduce', details: 'saving'});
    		
    		var id = rec.save({ignoreMandatoryFields: true});
    		
    		log.audit({ title: 'reduce', details: 'saved'});
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
            log.audit({ title: 'summarize', details: 'Process id: ' + key + '. Error was: ' + JSON.parse(value).message});
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
