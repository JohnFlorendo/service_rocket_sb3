define(['./lib/hcmfmupdate'],
/**
 * @param {record} record
 */
function(hcmfmupdate) {
	
	updateFuncMapFields = function(newRec) {
		
		newRec = hcmfmupdate.updateFuncMapFields(newRec);
		
		return newRec;
	}
	
    return {
		updateFuncMapFields: updateFuncMapFields
    };
    
});
