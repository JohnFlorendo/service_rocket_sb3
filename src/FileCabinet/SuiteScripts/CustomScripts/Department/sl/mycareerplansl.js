/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime'],
/**
 * @param {record} record
 */
function(record, runtime) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {

    	var paramReq = context.request.parameters;
    	var sRequest = context.request.body;
    	
    	log.audit({
    	    title: 'Server Request Body',
    	    details: sRequest
    	});
    	
    	//params to JSON
    	var objRequest = JSON.parse('{"' + decodeURI(sRequest.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
    	
    	log.audit({
    	    title: 'Server Request Body',
    	    details: JSON.stringify(objRequest)
    	});
    	
    	if(objRequest.action == 'updatecareer'){
    		
        	var recPlan = record.load({
        	    type: 'customrecord_mycareer',
        	    id: objRequest.career
        	});
        	
        	if(objRequest.thisisme == 'true'){
        		
        		recPlan.setValue({
            	    fieldId: 'custrecord_myc_thisisme',
            	    value: objRequest.job
            	});
        		
        		if( recPlan.getValue('custrecord_myc_workingtobe').indexOf(objRequest.job) > -1 ){
        			
        			
        			var arrJob = recPlan.getValue('custrecord_myc_workingtobe');
        			
        			arrJob.splice(recPlan.getValue('custrecord_myc_workingtobe').indexOf(objRequest.job), 1);
        			
        			recPlan.setValue({
                	    fieldId: 'custrecord_myc_workingtobe',
                	    value: arrJob
                	});
        		}
        		
        		
        		if( recPlan.getValue('custrecord_myc_iamiterested').indexOf(objRequest.job) > -1 ){
        			
        			
        			var arrJob = recPlan.getValue('custrecord_myc_iamiterested');
        			
        			arrJob.splice(recPlan.getValue('custrecord_myc_iamiterested').indexOf(objRequest.job), 1);
        			
        			recPlan.setValue({
                	    fieldId: 'custrecord_myc_iamiterested',
                	    value: arrJob
                	});
        		}
        		
        	}
        	else if(objRequest.workingtobe == 'true'){
       		
          		var arrJob = recPlan.getValue('custrecord_myc_workingtobe');
        		arrJob.push(objRequest.job);
        		
        		recPlan.setValue({
            	    fieldId: 'custrecord_myc_workingtobe',
            	    value: arrJob
            	});
        		
        		
        		if(recPlan.getValue('custrecord_myc_thisisme') == objRequest.job){
        			recPlan.setValue({
                	    fieldId: 'custrecord_myc_thisisme',
                	    value: ''
                	});
        		}
        		
        		if( recPlan.getValue('custrecord_myc_iamiterested').indexOf(objRequest.job) > -1 ){
        			
        			
        			var arrJob = recPlan.getValue('custrecord_myc_iamiterested');
        			
        			arrJob.splice(recPlan.getValue('custrecord_myc_iamiterested').indexOf(objRequest.job), 1);
        			
        			recPlan.setValue({
                	    fieldId: 'custrecord_myc_iamiterested',
                	    value: arrJob
                	});
        		}
        	}
        	else if(objRequest.iamiterested == 'true'){
        		
        		var arrJob = recPlan.getValue('custrecord_myc_iamiterested');
        		arrJob.push(objRequest.job);
        		
        		recPlan.setValue({
            	    fieldId: 'custrecord_myc_iamiterested',
            	    value: arrJob
            	});
        		
        		if(recPlan.getValue('custrecord_myc_thisisme') == objRequest.job){
        			recPlan.setValue({
                	    fieldId: 'custrecord_myc_thisisme',
                	    value: ''
                	});
        		}
        		
        		if( recPlan.getValue('custrecord_myc_workingtobe').indexOf(objRequest.job) > -1 ){
        			
        			var arrJob = recPlan.getValue('custrecord_myc_workingtobe');
        			
        			arrJob.splice(recPlan.getValue('custrecord_myc_workingtobe').indexOf(objRequest.job), 1);
        			
        			recPlan.setValue({
                	    fieldId: 'custrecord_myc_workingtobe',
                	    value: arrJob
                	});
        		}
        		
        	}
        	else{
        		
        		if(objRequest.thisisme == 'false'){
        			
        			recPlan.setValue({
                	    fieldId: 'custrecord_myc_thisisme',
                	    value: ''
                	});
        			
        		}
        		
        		if(objRequest.workingtobe == 'false'){
        			
        			
            		if( recPlan.getValue('custrecord_myc_workingtobe').indexOf(objRequest.job) > -1 ){

            			var arrJob = recPlan.getValue('custrecord_myc_workingtobe');
            			
            			arrJob.splice(recPlan.getValue('custrecord_myc_workingtobe').indexOf(objRequest.job), 1);
            			
            			recPlan.setValue({
                    	    fieldId: 'custrecord_myc_workingtobe',
                    	    value: arrJob
                    	});
            		}
        		}

        		if(objRequest.iamiterested == 'false'){
        			
        			
            		if( recPlan.getValue('custrecord_myc_iamiterested').indexOf(objRequest.job) > -1 ){

            			var arrJob = recPlan.getValue('custrecord_myc_iamiterested');
            			
            			arrJob.splice(recPlan.getValue('custrecord_myc_iamiterested').indexOf(objRequest.job), 1);
            			
            			recPlan.setValue({
                    	    fieldId: 'custrecord_myc_iamiterested',
                    	    value: arrJob
                    	});
            		}
        		}
        		
        	}        	

        	var idPlan = recPlan.save();
        	
        	
    	}
    	else if(objRequest.action == 'comment'){
    		
    		
    		var rec = record.create({
    			type: record.Type.NOTE,
    			isDynamic: true
    		});
	    		rec.setValue({fieldId: 'record', value: objRequest.career});
	    		rec.setValue({fieldId: 'recordtype', value: 1372});
	    		rec.setValue({fieldId: 'title', value: decodeURIComponent(objRequest.title)});
	    		rec.setValue({fieldId: 'note', value: decodeURIComponent(objRequest.message).replace(/\r?\n|\r/g,' ')});
	    		
    		var id = rec.save();
    		
    		context.response.write({
        	    output: 'Comment received.'
        	});		
    	}
    	
    }

    return {
        onRequest: onRequest
    };
    
});
