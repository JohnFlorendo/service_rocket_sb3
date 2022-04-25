define(['N/record', './lib/employeetree'],

function(record, employeetree) {
	
	updateFuncMapFields = function(newRec) {
		
		try{
			var recEmployee = record.load({type: newRec.type, id: newRec.id, isDynamic: true});
			
			var recHcm = record.load({type: 'hcmjob', id: recEmployee.getValue({fieldId: 'job'}), isDynamic: true});
			recHcm = hcmfmupdate.updateFuncMapFields(newRec);
			recHcm.save();	
		}
		catch(e) { log.debug('ERROR', e); }
	};
	
	updateEmployeeTree = function(option){
		
		return  employeetree.update(option);
	};
	
    return {
		updateFuncMapFields: updateFuncMapFields,
		updateEmployeeTree: updateEmployeeTree
    };
    
});
