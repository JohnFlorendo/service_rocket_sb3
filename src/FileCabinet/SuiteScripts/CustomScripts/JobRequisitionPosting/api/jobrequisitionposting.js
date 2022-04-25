define(['N/record', 'N/https', '../../Webflow/api/webflow'],

function(record, https, webflow) {
	
	createJobRequisitionPosting = function(option){
		return webflow.createJobRequisitionPosting(option);
	};
	
	updateJobRequisitionPosting = function(option){
		return webflow.updateJobRequisitionPosting(option);
	};
	
    return {
    	createJobRequisitionPosting: createJobRequisitionPosting,
    	updateJobRequisitionPosting: updateJobRequisitionPosting
    };
    
});
