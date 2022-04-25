define(['./lib/careerlist', './lib/careerworkingtobe', './lib/careerinterested'],

function(careerlist, careerworkingtobe, careerinterested) {
	
	getMyCareerList = function(option){
		return careerlist.get(option);
	};
	
	getMyCareerWorktingToBe = function(option){
		
		return careerworkingtobe.get(option);
	};
	
	getMyCareerInterested = function(option){
		
		return careerinterested.get(option);
	};
	
    return {
    	getMyCareerList: getMyCareerList,
    	getMyCareerWorktingToBe: getMyCareerWorktingToBe,
    	getMyCareerInterested: getMyCareerInterested
    };
    
});
