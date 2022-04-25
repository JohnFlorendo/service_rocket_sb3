define(['../../SuitePDF/api/lib/promotionletter'],

function(promotionletter) {
   
	uploadPromotionLetter = function(option){
		promotionletter.generate(option);
	};
	
    return {
    	uploadPromotionLetter: uploadPromotionLetter
    };
    
});
