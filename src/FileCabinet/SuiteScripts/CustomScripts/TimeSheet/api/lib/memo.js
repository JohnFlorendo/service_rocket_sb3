define([],

function() {
	
	
	getBeforeEdit = function(currRec){
		
		try{
			var arrMemo = [];
			
			for (var nDay = 0; nDay <= 6; nDay++) {
				
				var sMemo = currRec.getCurrentSublistValue({sublistId: 'timeitem', fieldId: 'memo'+ nDay});
				
				arrMemo[nDay] = sMemo;
			}
			window.memos = arrMemo;
			window.oldservitem = currRec.getCurrentSublistValue({sublistId: 'timeitem', fieldId: 'item'});
		}
		catch (err){
		
		}

	};
	
	set = function(scriptContext, currRec){
		
		try{
			
			
			if(window.oldservitem == currRec.getCurrentSublistValue({sublistId: 'timeitem', fieldId: 'item'})){
				
				var sFieldId = scriptContext.fieldId;
				var sMemo = currRec.getCurrentSublistValue({sublistId: 'timeitem', fieldId: sFieldId});
				var indxMemo = sFieldId.replace('memo', '');
				window.memos[indxMemo] = sMemo;
			}
		}
		catch (err){
		
		}

	};
	
	revert = function(currRec){
		
		try{
			var arrMemo = [];
			
			for (var nDay = 0; nDay <= 6; nDay++) {
				currRec.setCurrentSublistValue({sublistId: 'timeitem', fieldId: 'memo'+ nDay, value : window.memos[nDay]});
			}
		}
		catch (err){
			
		}

	};
	
    return {
    	getBeforeEdit: getBeforeEdit,
    	set: set,
    	revert: revert
    };
    
});
