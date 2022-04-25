define(['N/record','../../Job/api/lib/hcmfmupdate'],

function(record, hcmfmupdate) {
	
	updateFuncMapFields = function(newRec) {
		
		newRec = record.load({type: 'hcmjob', id: newRec.getValue({fieldId: 'custrecord_jc_job'}), isDynamic: true});
		newRec = hcmfmupdate.updateFuncMapFields(newRec);
		var id = newRec.save(); 
	};
	
    return {
		updateFuncMapFields: updateFuncMapFields
    };
    
});
