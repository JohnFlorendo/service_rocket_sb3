/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/search'],

function(search) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	
    	var retMe = [];

    	var srch = search.load({
    	    id: 'customsearch_jobrequesition_external'
    	});
    	var res = getAllResults(srch);

    	res.forEach(function (result) {

    	    retMe.push({
    	        'id': result.id,
    	        'jobid': result.getValue({
    	            name: 'hcmjob'
    	        }),
    	        'jobname': result.getText({
    	            name: 'hcmjob'
    	        }),
    	        'title': result.getValue({
    	            name: 'title'
    	        }),
    	        'department': result.getValue({
    	            name: 'department'
    	        }),
    	        'departmentname': result.getText({
    	            name: 'department'
    	        }),
    	        'location': result.getValue({
    	            name: 'location'
    	        }),
    	        'locationname': result.getText({
    	            name: 'location'
    	        }),
    	        'roleSummary': result.getValue({
    	            name: 'postingdescription'
    	        }),
    	        'responsibilities': result.getValue({
    	            name: 'custrecord_responsibilites'
    	        }),
    	        'otherResponsibilities': result.getValue({
    	            name: 'custrecord_otherresponsibilities'
    	        }),
    	        'requirements': result.getValue({
    	            name: 'custrecord_requirements'
    	        }),
    	        'niceToHaves': result.getValue({
    	            name: 'custrecord_nicetohaves'
    	        })
    	    })
    	});
    	
    	if(retMe.length > 0){
    		
    		context.response.setHeader({
    		    name: 'Content-Type',
    		    value: 'application/json'
    		});
    		context.response.write(JSON.stringify(retMe));	
    	}
    	else{
    		context.response.setHeader({
    		    name: 'Content-Type',
    		    value: 'application/json'
    		});
    		context.response.write('{message: "NO_RECORD_FOUND"}');
    	}
    	
    }
    
	getAllResults = function(s) {
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
        onRequest: onRequest
    };
    
});
