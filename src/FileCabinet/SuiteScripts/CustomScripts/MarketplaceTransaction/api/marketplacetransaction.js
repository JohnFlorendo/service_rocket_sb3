define(['N/record', '../../Marketplace/api/chargebee'],
/**
 * @param {record} record
 */
function(record, chargebee) {
	
	
	updateInvoice = function(newRec){
		
		newRec = chargebee.updateInvoice({
		    nsid: newRec.id
		});
		
		return newRec;
	};
	
    return {
    	updateInvoice: updateInvoice
    };
    
});