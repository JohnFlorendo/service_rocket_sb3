define(['../../Lever/api/lever'],

function(lever) {
	
	syncLever = function(option){

		if (option.record.getValue({
	        fieldId: 'custrecord_jr_leverid'
	    }) == '' || !option.record.getValue({
	        fieldId: 'custrecord_jr_leverid'
	    })) {

		    return lever.createRequisition(option);
	
		} 
		else{
	
		    return lever.updateRequisition(option);
		}
	};
	
    return {
    	syncLever: syncLever
    };
    
});
