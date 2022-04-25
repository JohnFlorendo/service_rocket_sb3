define(['../api/lib/requisition', '../api/lib/user', '../api/lib/opportunity', '../api/lib/offer'],

function(requisition, user, opportunity, offer) {
	
	createRequisition = function(option){
		return requisition.create(option);
	};
   
	updateRequisition = function(option){
		return requisition.update(option);
	};
	
	getOpportunity = function(option) {
		return opportunity.get(option);
	};
	
	createOffer = function(option) {
		return offer.create(option);
	};
	updateOffer = function(option) {
		return offer.update(option);
	};
	
	searchUser = function(option) {
		
	};
	
    return {
    	createRequisition: createRequisition,
    	updateRequisition: updateRequisition,
    	getOpportunity: getOpportunity,
    	createOffer: createOffer,
    	updateOffer: updateOffer,
    	searchUser: searchUser
    };
    
});
