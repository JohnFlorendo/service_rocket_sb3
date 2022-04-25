define(['./lib/pendingapproval', './lib/approved', './lib/mine'],

function(pendingapproval, approved, mine) {
   
	getMyApproval = function (option) {
	
		return pendingapproval.get(option);
		
	};
	
	getApproved = function (option) {
		
		return approved.get(option);
		
	};
	
	getMine = function (option) {
		
		return mine.get(option);
		
	};
	
    return {
    	getMyApproval: getMyApproval,
    	getApproved: getApproved,
    	getMine: getMine
    };
    
});
