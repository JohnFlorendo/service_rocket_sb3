define(['N/runtime', '../../SuiteBox/api/suitebox'],

function(runtime, suitebox, customjorbrequisition) {
	
	createFolder = function (newRec){
		
		var objFolder = suitebox.createFolder({	name: newRec.getValue({fieldId: 'tranid'}), 
												parent: null}, 
											  { record: 'purchaserequisition', 
												id: newRec.id });
		
		var objCollab = suitebox.addCollab({type: 'folder', 
										id: objFolder.id , 
										email: runtime.getCurrentUser().email,
										role: 'co-owner',
										usertype: 'user'}, 'purchaserequisition');
		
	
		return objFolder;
		
	}
	
    return {
    	createFolder: createFolder
    };
    
});
