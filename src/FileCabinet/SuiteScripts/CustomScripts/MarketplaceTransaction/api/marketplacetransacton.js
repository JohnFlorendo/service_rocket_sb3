define(['N/record', '../../Marketplace/api/chargebee'],
/**
 * @param {record} record
 */
function(record, chargebee) {
	
	
	updateTransaction = function(newRec){
		
		newRec = chargebee.updateTransaction({
		    nsid: newRec.id
		});
		
		return newRec;
	};
	
    return {
    	updateTransaction: updateTransaction
    };
    
});