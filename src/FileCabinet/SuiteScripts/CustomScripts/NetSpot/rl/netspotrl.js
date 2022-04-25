/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', '../api/netspot', '../api/project'],
/**
 * @param {record} record
 * @param {search} search
 */
function(record, search, netspot, project) {
   
    /**
     * Function called upon sending a GET request to the RESTlet.
     *
     * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed into function as an Object (for all supported content types)
     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
     * @since 2015.1
     */
    function doGet(requestParams) {
    	
    	//log.audit({title: 'doGet', details: 'entry ' + JSON.stringify(requestParams)});
    	
    	var retMe;
    	
    	if(requestParams.associatedObjectType == 'DEAL'){
    		retMe = netspot.generateHubCard(requestParams, 'opportunity');	
    	}
    	else if(requestParams.associatedObjectType == 'COMPANY'){
    		retMe = netspot.generateHubCard(requestParams, 'customer');
    	}

    	//log.audit({title: 'doGet', details: 'response ' + JSON.stringify(retMe)});
    	
    	return retMe;
    }

    /**
     * Function called upon sending a PUT request to the RESTlet.
     *
     * @param {string | Object} requestBody - The HTTP request body; request body will be passed into function as a string when request Content-Type is 'text/plain'
     * or parsed into an Object when request Content-Type is 'application/json' (in which case the body must be a valid JSON)
     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
     * @since 2015.2
     */
    function doPut(requestBody) {
    	log.audit({title: 'doPut', details: 'entry ' + JSON.stringify(requestBody)});
    }


    /**
     * Function called upon sending a POST request to the RESTlet.
     *
     * @param {string | Object} requestBody - The HTTP request body; request body will be passed into function as a string when request Content-Type is 'text/plain'
     * or parsed into an Object when request Content-Type is 'application/json' (in which case the body must be a valid JSON)
     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
     * @since 2015.2
     */
    function doPost(requestBody) {
    	
    	try{
	    	log.audit({title: 'doPost', details: 'entry ' + JSON.stringify(requestBody)});
	    	
	    	var retMe = requestBody;
	    	
	    	if(requestBody != undefined && requestBody != ''){
	    		
	    		if(requestBody.action == 'create' && requestBody.record == 'pmojob'){
	    			log.audit({title: 'doPost', details: 'creating pmo job'});
	    			retMe = project.createPmo(requestBody);	
	    		}
	    		else if(requestBody.associatedObjectType == 'DEAL'){
	    			retMe = netspot.updateOpportunity(requestBody);
	    		}
	    		else{
	    			retMe = netspot.getHubRequest(requestBody);	
	    		}
	    	}
	    	else{
	    		retMe = "{'error': 'emtpy request body' }";
	    	}
	    	
	    	
	    	log.audit({title: 'doPost', details: 'response ' + JSON.stringify(retMe)});
	    	
	    	return retMe;
	    	
	    }
		catch(err){
			log.audit({title: 'doPost', details: 'error ' + err});
			return {'message': 'error ' +  err};
		}
    }

    /**
     * Function called upon sending a DELETE request to the RESTlet.
     *
     * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed into function as an Object (for all supported content types)
     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
     * @since 2015.2
     */
    function doDelete(requestParams) {

    }

    return {
        'get': doGet,
        put: doPut,
        post: doPost,
        'delete': doDelete
    };
    
});
