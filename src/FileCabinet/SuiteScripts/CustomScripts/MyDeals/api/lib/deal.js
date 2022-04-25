define(['../../../SuiteTable/api/suitetable'],

function(suitetable) {
   
	get = function(option){
		
		var arrMyDeals = suitetable.getData({
			sqlfile: 'SuiteScripts/CustomScripts/MyDeals/sql/mydeals.sql',
			params: option.params
		});
		
        log.audit({
            title: 'get',
            details: arrMyDeals.data.length
        });
		
		if(arrMyDeals.data.length > 0){
			
			var arrEstimate = suitetable.getData({
				sqlfile: 'SuiteScripts/CustomScripts/MyDeals/sql/estimate.sql',
				params: [option.params[0], option.params[0]]
			});
			
			var arrSalesOrder = suitetable.getData({
				sqlfile: 'SuiteScripts/CustomScripts/MyDeals/sql/salesorder.sql',
				params: [option.params[0]]
			});
			
			var arrInvoice = suitetable.getData({
				sqlfile: 'SuiteScripts/CustomScripts/MyDeals/sql/invoice.sql',
				params: [option.params[0]]
			});
			
			
			arrSalesOrder.data.forEach(function (salesorder, idx, arrSalesOrder) {
				
				var objInvoice = arrInvoice.data.filter(function(invoice) {
					return invoice[5] == salesorder[1];
				});
				
				if(objInvoice.length > 0){
					arrSalesOrder[idx].push(objInvoice);
				}
				
			});
			
			arrEstimate.data.forEach(function (estimate, idx, arrEstimate) {
				
				var objSalesOrder = arrSalesOrder.data.filter(function(salesorder) {
					return salesorder[5] == estimate[1];
				});
				
				if(objSalesOrder.length > 0){
					arrEstimate[idx].push(objSalesOrder);
				}
				
			});
			
			
			arrMyDeals.data.forEach(function (mydeal, idx, arrMyDeals) {
	        	
				var objEstimate = arrEstimate.data.filter(function(estimate) {
					return estimate[0] == mydeal[13];
				});
				
				if (objEstimate.length > 0){
					
					if(arrMyDeals[idx][10] == null){
						
						arrMyDeals[idx][10] = JSON.stringify(objEstimate);
					}
					else{
						var a = JSON.parse(arrMyDeals[idx][10]);
						a.estimate.push(objEstimate);
						arrMyDeals[idx][10] = JSON.stringify(a);
					}
				}
				
//				var objSalesOrder = arrSalesOrder.data.filter(function(salesorder) {
//					return salesorder[0] == mydeal[13];
//				});
//				
//				if (objSalesOrder.length > 0){
//					
//					if(arrMyDeals[idx][10] == null){
//						arrMyDeals[idx][10] = JSON.stringify(objSalesOrder);
//					}
//					else{
//						var a = JSON.parse(arrMyDeals[idx][10]);
//						a.push(objSalesOrder);
//						arrMyDeals[idx][10] = JSON.stringify(a);
//					}
//					
//					a = JSON.parse(arrMyDeals[idx][10]);
//					a.salesorder.push(objSalesOrder);
//					arrMyDeals[idx][10] = JSON.stringify(a);
//				}
//				
//				var objInvoice = arrInvoice.data.filter(function(invoice) {
//					return invoice[0] == mydeal[13];
//				});
//				
//				if (objInvoice.length > 0){
//					
//					if(arrMyDeals[idx][12] == null){
//						arrMyDeals[idx][12] = JSON.stringify(objInvoice);
//					}
//					else{
//						var a = JSON.parse(arrMyDeals[idx][10]);
//						a.push(objInvoice);
//						arrMyDeals[idx][11] = JSON.stringify(a);
//					}
//					
//					a = JSON.parse(arrMyDeals[idx][10]);
//					a.invoice.push(objInvoice);
//					arrMyDeals[idx][10] = JSON.stringify(a);
//					
//				}
	        });
			
			return arrMyDeals;
			
		}
		else{
			return [];
		}
		

	};
	
    return {
    	get: get
    };
    
});
