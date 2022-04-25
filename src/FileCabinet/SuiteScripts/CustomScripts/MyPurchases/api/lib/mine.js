define(['../../../SuiteTable/api/suitetable'],
/**
 * @param {suitetable} suitetable
 */
function(suitetable) {
   
	get = function(option){
		
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
