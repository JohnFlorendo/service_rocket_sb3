define(['../../../SuiteTable/api/suitetable'],
/**
 * @param {file} file
 */
function(suitetable) {
   
	get = function(option){
		
		option.params[2] = 2;//Approved param
		
		var arrMyDeals = suitetable.getData({
			sqlfile: 'SuiteScripts/CustomScripts/MyPurchases/sql/purchaserequisiton.sql',
			params : option.params
		});
		
		return arrMyDeals;
	};
	
    return {
        get:get
    };
    
});
