define(['./lib/deal'],

function(deal) {
   
	getDeals = function(option){
		return deal.get(option);
	};
	
    return {
    	getDeals: getDeals
    };
    
});
