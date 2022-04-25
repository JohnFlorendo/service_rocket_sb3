define(['N/record', '../../Marketplace/api/chargebee'],
/**
 * @param {record} record
 */
function(record, chargebee) {
	
	
	updateLicense = function(option){
		
		newRec = chargebee.updateLicense(option);
		
		return newRec;
	};
	
    return {
    	updateLicense: updateLicense
    };
    
});