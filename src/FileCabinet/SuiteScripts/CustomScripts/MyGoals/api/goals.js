define(['./lib/mine'],

function(mine) {
	
	getMine = function (option){
		return mine.get(option);
	};
	
    return {
    	getMine: getMine
    };
    
});
