define([],
/**
 * @param {record} record
 */
		
		
function() {
	
	var SFACTIVEMPLOYEES = 'custrecord_sf_activeemployees';
	var ACTIVEMPLOYEES = 'custrecord_sr_job_active_employee';
	
	var SFFUNCTIONS = 'custrecord_sf_functions';
	var FUNCTIONS = 'custrecord_sr_job_active_function';
	
	var SFCOMPETENCIES = 'custrecord_sf_competency';
	var COMPETENCIES = 'custrecord_sr_job_active_competency';
   
	updateFuncMapFields = function(newRec) {
		
		newRec.setValue({fieldId: ACTIVEMPLOYEES, value: newRec.getValue({fieldId: SFACTIVEMPLOYEES})});
		newRec.setValue({fieldId: FUNCTIONS, value: newRec.getValue({fieldId: SFFUNCTIONS})});
		newRec.setValue({fieldId: COMPETENCIES, value: newRec.getValue({fieldId: SFCOMPETENCIES})});
		
		return newRec;
	}
	
    return {
    	updateFuncMapFields: updateFuncMapFields
    };
    
});
