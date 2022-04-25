define(['N/record', './lib/salesrep', './lib/margin', './lib/opportunity'],
/**
 * @param {record} record
 */
function(record, salesrep, margin) {
	
	
	setUserAsPrimarySalesRepBeforeLoad = function(newRec, user){
		return salesrep.setUserAsPrimarySalesRepBeforeLoad(newRec, user);
	};
	
	setUserAsPrimarySalesRep = function(newRec, user){
		return salesrep.setUserAsPrimarySalesRep(newRec, user);
	};
	
	syncRepToOpp = function(newRec, recOpp){
		return salesrep.syncRepToOpp(newRec, recOpp);
	};
	
	computeMargin = function(newRec, recOpp){
		return margin.computeMargin(newRec, recOpp);
	};
	
	updateOpportunityAmmount = function (newRec, recOpp){
		return opportunity.updateAmount(newRec);
	};
	
    return {
    	setUserAsPrimarySalesRepBeforeLoad: setUserAsPrimarySalesRepBeforeLoad,
    	setUserAsPrimarySalesRep: setUserAsPrimarySalesRep,
    	syncRepToOpp: syncRepToOpp,
    	computeMargin: computeMargin,
    	updateOpportunityAmmount: updateOpportunityAmmount
    };
    
});