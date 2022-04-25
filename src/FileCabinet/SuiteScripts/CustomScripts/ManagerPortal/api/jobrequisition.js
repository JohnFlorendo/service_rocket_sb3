define(['./lib/pbojobrequisition'],

function(pbojobrequisition) {
   
	getPboRequisition = function (option){
		return pbojobrequisition.get(option);
	};
	
    return {
    	getPboRequisition: getPboRequisition
    };
    
});
