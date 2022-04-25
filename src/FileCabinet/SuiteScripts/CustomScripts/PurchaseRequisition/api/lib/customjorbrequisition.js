define(['N/record'],
/**
 * @param {record} record
 */
function(record) {
	
	createJobRequisistion = function(newRec){
		
		var rec = record.create({
		    type: 'customrecord_jobrequisition',
		    isDynamic: true,
		    defaultValues: {
		        custrecord_jr_origjobreq: newRec.id,
		        custrecord_jr_postingdescription: newRec.getValue({
		            fieldId: 'postingdescription'
		        })
		    }
		});
		
		var id = rec.save();
		
	};
    return {
    	createJobRequisistion: createJobRequisistion
    };
    
});
