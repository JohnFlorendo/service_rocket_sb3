define(['./lib/rocketeers', './lib/reviewrocketeers', './lib/newrocketeers', './lib/prehirerocketeers', './lib/activerocketeers', './lib/leaverocketeers', './lib/terminatedrocketeers'
        , './lib/jobrequisitions'],

function(rocketeers, reviewrocketeers, newrocketeers,  prehirerocketeers, activerocketeers, leaverocketeers, terminatedrocketeers, jobrequisitions) {
   
	getRocketeers = function(option){
		return rocketeers.get(option);
	};
	
	getReviewRocketeers = function(option){
		return reviewrocketeers.get(option);
	};
	
	getNewRocketeers = function(option){
		return newrocketeers.get(option);
	};
	
	getPrehireRocketeers = function(option){
		return prehirerocketeers.get(option);
	};
	
	getActiveRocketeers = function(option){
		return activerocketeers.get(option);
	};
	
	getLeaveRocketeers = function(option){
		return leaverocketeers.get(option);
	};
	
	getTerminatedRocketeers = function(option){
		return terminatedrocketeers.get(option);
	};
	
	getJobRequisitions = function(option){
		return jobrequisitions.get(option);
	};
	
	
    return {
    	getRocketeers: getRocketeers,
    	getReviewRocketeers: getReviewRocketeers,
    	getNewRocketeers: getNewRocketeers,
    	getPrehireRocketeers: getPrehireRocketeers,
    	getActiveRocketeers: getActiveRocketeers,
    	getLeaveRocketeers: getLeaveRocketeers,
    	getTerminatedRocketeers: getTerminatedRocketeers,
    	getJobRequisitions: getJobRequisitions
    };
    
});
