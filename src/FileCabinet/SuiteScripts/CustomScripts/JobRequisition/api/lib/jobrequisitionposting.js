define(['N/record'],
/**
 * @param {record} record
 */
function(record) {
	
	createJobRequisitionPosting = function(newRec){
		
		try {
			var rec = record.create({
			    type: 'customrecord_jobrequisition',
			    isDynamic: true
			});

			rec.setValue({
			    fieldId: 'custrecord_jr_origjobreq',
			    value: newRec.id
			});

			var id = rec.save();

			return id;
		} 
		catch (err) {
			log.audit({
			    title: 'createJobRequisitionPosting',
			    details: 'Error: ' + err
			});
		}
		
	};
    return {
    	createJobRequisitionPosting: createJobRequisitionPosting
    };
    
});
