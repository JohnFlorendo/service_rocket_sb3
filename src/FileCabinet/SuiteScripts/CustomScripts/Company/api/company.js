define(['./lib/hscompany'],

function(hscompany) {
	
	createHsCompany = function(option){
		
		var retMe = hscompany.create(option);
		
		return retMe;

	};
	
    return {
    	createHsCompany: createHsCompany
    };
    
});
