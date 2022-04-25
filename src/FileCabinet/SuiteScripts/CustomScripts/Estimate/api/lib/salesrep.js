define(['N/record'],
/**
 * @param {record} record
 */
function(record) {
	
	setUserAsPrimarySalesRepBeforeLoad = function(newRec, user){
		
		log.audit({title: 'salesrep.setUserAsPrimarySalesRepBeforeLoad' , details: 'user: ' + user});
		
		newRec.setSublistValue({sublistId: 'salesteam', fieldId: 'employee', value: user, line:0});
		newRec.setSublistValue({sublistId: 'salesteam', fieldId: 'isprimary', value: true, line:0});
		newRec.setSublistValue({sublistId: 'salesteam', fieldId: 'salesrole', value: -2, line:0});
		newRec.setSublistValue({sublistId: 'salesteam', fieldId: 'contribution', value: 100, line:0});
	};
	
	setUserAsPrimarySalesRep = function(newRec, user){
	
		if(newRec.getLineCount({sublistId: 'salesteam'}) > 0){
			
			for (var nLine1 = 0; nLine1 < newRec.getLineCount({ sublistId: 'salesteam'}); nLine1++) {
							
				var idSalesRep = newRec.getSublistValue({ sublistId: 'salesteam', fieldId: 'employee', line: nLine1});
				
				if(user == idSalesRep){
					newRec.selectLine({sublistId: 'salesteam', line : nLine1});
					newRec.setCurrentSublistValue({sublistId: 'salesteam', fieldId: 'isprimary', value: true});
					newRec.setCurrentSublistValue({sublistId: 'salesteam', fieldId: 'salesrole', value: -2});
					newRec.setCurrentSublistValue({sublistId: 'salesteam', fieldId: 'contribution', value: 100});
					newRec.commitLine({sublistId: 'salesteam'});
				}
				else{
					
					newRec.removeLine({ sublistId: 'salesteam', line: nLine1});
				}
			}
		}
		else{
			
			newRec.selectNewLine({sublistId: 'salesteam'});
			newRec.setCurrentSublistValue({sublistId: 'salesteam', fieldId: 'employee', value: user});
			newRec.setCurrentSublistValue({sublistId: 'salesteam', fieldId: 'isprimary', value: true});
			newRec.setCurrentSublistValue({sublistId: 'salesteam', fieldId: 'salesrole', value: -2});
			newRec.setCurrentSublistValue({sublistId: 'salesteam', fieldId: 'contribution', value: 100});
			newRec.commitLine({sublistId: 'salesteam'});	
		}
		
		return newRec;
	};
	
	syncRepToOpp = function(newRec, recOpp){
		
		log.audit({title: 'syncRepToOpp', details: 'enter'});
		
		for (var nLine0 = 0; nLine0 < newRec.getLineCount({ sublistId: 'salesteam'}); nLine0++) {
			
			var idSalesRep0 = newRec.getSublistValue({ sublistId: 'salesteam', fieldId: 'employee', line: nLine0 });
				
			var isFound = false;
			
			for (var nLine1 = 0; nLine1 < recOpp.getLineCount({ sublistId: 'salesteam'}); nLine1++) {
				
				var idSalesRep1 = recOpp.getSublistValue({
									sublistId: 'salesteam', 
									fieldId: 'employee', 
									line: nLine1
								  });
				
				if(idSalesRep0 == idSalesRep1){
					isFound = true;
				}
				else{
					
					recOpp.removeLine({
					    sublistId: 'salesteam', 
					    line: nLine1
					});
				}
			}
			
			if(!isFound){
				recOpp.selectNewLine({sublistId: 'salesteam'});
				recOpp.setCurrentSublistValue({sublistId: 'salesteam', fieldId: 'employee', value: idSalesRep0});
				recOpp.setCurrentSublistValue({sublistId: 'salesteam', fieldId: 'isprimary', value: newRec.getSublistValue({ sublistId: 'salesteam', fieldId: 'isprimary', line: nLine0 })});
				recOpp.setCurrentSublistValue({sublistId: 'salesteam', fieldId: 'salesrole', value: newRec.getSublistValue({ sublistId: 'salesteam', fieldId: 'salesrole', line: nLine0 })});
				recOpp.setCurrentSublistValue({sublistId: 'salesteam', fieldId: 'contribution', value: newRec.getSublistValue({ sublistId: 'salesteam', fieldId: 'contribution', line: nLine0 })});
				recOpp.commitLine({sublistId: 'salesteam'});
			}
		}
		
		return recOpp;
	};
	
    return {
    	
    	setUserAsPrimarySalesRepBeforeLoad: setUserAsPrimarySalesRepBeforeLoad,
    	setUserAsPrimarySalesRep: setUserAsPrimarySalesRep,
    	syncRepToOpp: syncRepToOpp
    };
    
});