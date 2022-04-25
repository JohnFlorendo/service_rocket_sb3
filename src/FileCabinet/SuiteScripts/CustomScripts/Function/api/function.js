define(['N/record', 'N/task'],
/**
 * @param {record} record
 */
function(record, task) {
	
	var PARAMFUNCTION = 'custscript_fm_function';
	var SCRIPTFUNCTION = 'customscript_function_mr';
		
	updateFuncMapFields = function(newRec) {
		
		try{
			
	       	var mrTask = task.create({ taskType: task.TaskType.MAP_REDUCE });
	       	mrTask.scriptId = SCRIPTFUNCTION;
	       	mrTask.deploymentId = null;
	       	mrTask.params = {'custscript_fm_function' : newRec.id};
	        var idTask = mrTask.submit();
		}
		catch (err) {
			log.audit({ title: 'updateFuncMapFields', details: 'err: '+ err});
	    }
	}
	
    return {
    	updateFuncMapFields: updateFuncMapFields
    };
    
});
