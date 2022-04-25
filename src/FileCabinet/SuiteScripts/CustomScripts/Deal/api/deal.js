define(['./lib/hsdeal'],

function(hsdeal) {
	
	createHsDeal = function(option){
		
		var retMe = hsdeal.create(option);
		
		return retMe;

	};
	
    return {
    	createHsDeal: createHsDeal
    };
    
});
