define(['N/runtime', 'N/search', 'N/file', 'N/ui/serverWidget', '../../Library/handlebars', '../../SuiteBox/api/suitebox'],

function(runtime, search, file, serverWidget, handlebars, suitebox) {
   
	getLatestRAG = function(scriptContext) {
		
		var newRec = scriptContext.newRecord;
		
		var src = search.create({	type: 'customrecord_rag_status', 
									columns: ['name', 'custrecord_rgs_status', 'custrecord_rgs_author', 'custrecord_rgs_date', 'custrecord_rgs_notes'] });
		src.columns.push(search.createColumn({ name: 'internalid',
											    sort: search.Sort.DESC})) ;
		src.filters = [search.createFilter({	name: 'custrecord_rgs_project',
		    									operator: search.Operator.ANYOF,
		    									values: newRec.id})];
		var scrResultSet = src.run();
	    var results = scrResultSet.getRange({	start: 0,
	    										end: 1});
	    
	    if(results.length > 0){
	    	
	    	var objJson = {};
	    	objJson.name = results[0].getValue({name: 'name'});
	    	objJson.status = results[0].getText({name: 'custrecord_rgs_status'}).toLowerCase();
	    	objJson.author = results[0].getText({name: 'custrecord_rgs_author'});
	    	objJson.date = results[0].getValue({name: 'custrecord_rgs_date'});
	    	objJson.notes = results[0].getValue({name: 'custrecord_rgs_notes'});
	    	
//		    var form = scriptContext.form;
//	    	var fldRAG = form.addField({	id : 'custpage_rag_info',
//	    									type : serverWidget.FieldType.INLINEHTML,
//	    									label : 'RAG Status'});
	    	
	    	var sTemplate = file.load(105741); 
	    	var sHandlebar = handlebars.compile(sTemplate.getContents());
	    	var sHtmlTemplate = sHandlebar(objJson);
	    	
	    	//fldRAG.defaultValue = sHtmlTemplate;
	    	
	    	newRec.setValue({fieldId: 'custentity_rag_status', value: sHtmlTemplate})
	    	
	    }

	};
	
	createFolder = function(newRec){
		
		try{
			
			var emailProjectMngr = '';
			
			for (var nLine = 0; nLine < newRec.getLineCount({sublistId: 'jobresources'}); nLine++) {
				
				if(newRec.getSublistValue({sublistId: 'jobresources', fieldId: 'role', line: nLine}) == -2){
					emailProjectMngr = newRec.getSublistValue({sublistId: 'jobresources', fieldId: 'email', line: nLine});
					break;
				}
				
			}
			
			var objFolder = suitebox.createFolder({	name: newRec.getValue({fieldId: 'entityid'}), 
													parent: null}, 
												  { record: 'job', 
													id: newRec.id });
			
			var objCollab = suitebox.addCollab({type: 'folder', 
												id: objFolder.id , 
												email: emailProjectMngr,
												role: 'co-owner',
												usertype: 'user'}, 'job');
         }
         catch (err){
        	 log.audit({title: 'project.createFolder' , details: 'err: ' + err});
         }
	};
	
	//***updated,deployed 10 Mar 2021 ITSM-666
	copyParentFolder = function(newRec){
	
		var idParent = newRec.getValue({fieldId: 'parent'});
		var idCustomer = newRec.getValue({fieldId: 'customer'});
		
		if(idParent != idCustomer){
			
			var objFolder = suitebox.getFolderRecord({id: idParent, record: newRec.type});
			
			if(objFolder.status == 'ok'){
				objFolder.id = newRec.id;
				var id = suitebox.createFolderRecord(objFolder);
			}
		}
	};
	//***
	
	updateHours = function(newRec){
		
		newRec.setValue({	fieldId: 'custentity_billable_hours', 
			value : recJob.getValue({fieldId: 'custentity_sf_billable_hours'}) || 0 });
		newRec.setValue({	fieldId: 'custentity_nonbillable_hours', 
					value : recJob.getValue({fieldId: 'custentity_sf_nonbillable_hours'}) || 0});
		
		return newRec;
		
	};
	
    return {
    	getLatestRAG: getLatestRAG,
    	createFolder: createFolder,
    	copyParentFolder: copyParentFolder
    };
    
});


