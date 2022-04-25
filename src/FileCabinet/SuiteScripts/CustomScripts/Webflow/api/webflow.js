define(['./lib/jobrequisitionposting'],

function(jobrequisitionposting) {
   
	createJobRequisitionPosting = function(option){
		return jobrequisitionposting.createJobRequisitionPosting(option);
	};
	
	updateJobRequisitionPosting = function(option){
		return jobrequisitionposting.updateJobRequisitionPosting(option);
	};
	
    return {
    	createJobRequisitionPosting: createJobRequisitionPosting,
    	updateJobRequisitionPosting: updateJobRequisitionPosting
    };
    
});
