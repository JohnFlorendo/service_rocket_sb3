/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/file', 'N/search', 'N/ui/serverWidget', '../../Library/handlebars'],
/**
 * @param {file} file
 * @param {search} search
 */
function(file, search,serverWidget , handlebars) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {

    	//var sTemplate = file.load(127884);
    	var sTemplate = file.load(133005);
    	
    	var objDepartments = {departments : []};
    	var objJobs = {};
    	var objSteps = {};
    	var objFunctions = {};
    	var objEmpImage = {'':'/core/media/media.nl?id=367&c=3688201&h=511e15b5a7516900af5d'};
    	
    	var srch = search.load({id: 'customsearch_funcmap_image'}); //**DO NOT EDIT/DELETE** Employee Image Search
    	var res = getAllResults(srch);

    	res.forEach(function(result) {
    		objEmpImage[result.id] = result.getValue({name: 'url'});
    	});
    	
    	
    	var srch = search.load({id: 'customsearch_funcmap_job'}); // **DO NOT EDIT/DELETE** Job Search
    	var res = getAllResults(srch);

    	res.forEach(function(result) {
    		
    		var idFunction = result.getValue({name: 'custrecord_sr_function_job'});
    		var idJob = result.id;
    		var objJob = {id: idFunction, 
    						idjob: idJob,  
    						name: result.getText({name: 'custrecord_sr_job'}), 
    						hcmjob: result.getValue({name: 'custrecord_sr_job'})};
    		
    		if(objJobs[idFunction] == undefined){
    			objJobs[idFunction] = [objJob];
    		}
    		else{
    			objJobs[idFunction].push(objJob);
    		}
    	});
    	
    	var srch = search.load({id: 'customsearch_funcmap_cyclestep'}); //**DO NOT EDIT/DELETE** Cycle Step Search
    	var res = getAllResults(srch);

    	res.forEach(function(result) {
    		
    		var idStep = result.getValue({name: 'custrecord_fts_function'});
    		var objStep = {	id: idStep,
    					  master : result.getText({name: 'custrecord_sr_master_cycle', join: 'custrecord_fts_step'}),
    					  masterid : result.getValue({name: 'custrecord_sr_master_cycle', join: 'custrecord_fts_step'}),
    					  name: result.getText({name: 'custrecord_fts_step'}),
    					  accountable: result.getValue({name: 'custrecord_is_accountable'}) ? 'checked' : '',
    					  visible: result.getValue({name: 'custrecord_is_visible'}) ? 'checked' : '',
    					  approver: result.getValue({name: 'custrecord_is_approver'})? 'checked' : ''
    					  };
    		
    		if(objSteps[idStep] == undefined){
    			objSteps[idStep] = [objStep];
    		}
    		else{
    			objSteps[idStep].push(objStep);
    		}
    	});
    	
    	var srch = search.load({id: 'customsearch_funcmap_functions'}); //**DO NOT EDIT/DELETE** Functions  Search
    	var res = getAllResults(srch);
    	
    	res.forEach(function(result) {

    		var objFunction = {};
    		
    		var sDepartment = result.getValue({name: 'custrecord_sr_function_department'});
    		var idFunction = result.id;

    		
    		if(objFunctions[sDepartment] == undefined){
    			
    			objFunctions[sDepartment] = {};
    			
    			var objFunction = {};
    			objFunction.id = idFunction;
    			objFunction.name = result.getValue({name: 'name'});
    			objFunction.identifier = result.getValue({name: 'custrecord_sr_function_id'});
    			objFunction.objective = result.getValue({name: 'custrecord_sr_function_objective'});
    			objFunction.owner = result.getText({name: 'custrecord_sr_function_owner'});
    			objFunction.ownerimage = objEmpImage[result.getValue({name: 'image', join: 'custrecord_sr_function_owner'})];
    			objFunction.workplaceid = result.getValue({name: 'custentity_workplace_id', join: 'custrecord_sr_function_owner'});
    			
    			if(result.getValue({name: 'custrecord_sr_function_activity_id', join: 'custrecord_sr_activity_function'})){
    				
        			var objActivity = {};
        			objActivity.id = result.getValue({name: 'internalid', join: 'custrecord_sr_activity_function'});
        			objActivity.identifier = result.getValue({name: 'custrecord_sr_function_activity_id', join: 'custrecord_sr_activity_function'});
        			objActivity.description = result.getValue({name: 'custrecord_sr_activity_description', join: 'custrecord_sr_activity_function'});
        			objActivity.level = result.getValue({name: 'custrecord_sr_activity_level', join: 'custrecord_sr_activity_function'});
        			
        			objFunction.activities = [objActivity];
    			}
    			
    			if(objJobs[idFunction] != undefined){
    				objFunction.jobs = objJobs[idFunction]
    			}
    			else{
    				objFunction.jobs = [];
    			}
    			
    			if(objSteps[idFunction] != undefined){
    				objFunction.mastercyclestep = objSteps[idFunction];
    			}
    			else{
    				objFunction.mastercyclestep = [];
    			}
    			
    			objFunctions[sDepartment][idFunction] = objFunction;
   			
    			return true;
    			
    		}
    		else if(objFunctions[sDepartment][idFunction] == undefined){
    			
    			var objFunction = {};
    			objFunction.id = idFunction;
    			objFunction.name = result.getValue({name: 'name'});
    			objFunction.identifier = result.getValue({name: 'custrecord_sr_function_id'});
    			objFunction.objective = result.getValue({name: 'custrecord_sr_function_objective'});
    			objFunction.owner = result.getText({name: 'custrecord_sr_function_owner'});
    			objFunction.ownerimage = objEmpImage[result.getValue({name: 'image', join: 'custrecord_sr_function_owner'})] ;
    			objFunction.workplaceid = result.getValue({name: 'custentity_workplace_id', join: 'custrecord_sr_function_owner'});
    			
    			if(result.getValue({name: 'custrecord_sr_function_activity_id', join: 'custrecord_sr_activity_function'})){
    				
        			var objActivity = {};
        			objActivity.id = result.getValue({name: 'internalid', join: 'custrecord_sr_activity_function'});
        			objActivity.identifier = result.getValue({name: 'custrecord_sr_function_activity_id', join: 'custrecord_sr_activity_function'});
        			objActivity.description = result.getValue({name: 'custrecord_sr_activity_description', join: 'custrecord_sr_activity_function'});
        			objActivity.level = result.getValue({name: 'custrecord_sr_activity_level', join: 'custrecord_sr_activity_function'});
        			
        			objFunction.activities = [objActivity];
    			}
    			
    			if(objJobs[idFunction] != undefined){
    				objFunction.jobs = objJobs[idFunction]
    			}
    			else{
    				objFunction.jobs = [];
    			}
    			
    			if(objSteps[idFunction] != undefined){
    				objFunction.mastercyclestep = objSteps[idFunction];
    			}
    			else{
    				objFunction.mastercyclestep = [];
    			}
    			
    			objFunctions[sDepartment][idFunction] = objFunction;
    			
    			return true;
    		}
    		else{
    			
    			if(result.getValue({name: 'custrecord_sr_function_activity_id', join: 'custrecord_sr_activity_function'})){
    				
        			var objActivity = {};
        			objActivity.id = result.getValue({name: 'internalid', join: 'custrecord_sr_activity_function'});
        			objActivity.identifier = result.getValue({name: 'custrecord_sr_function_activity_id', join: 'custrecord_sr_activity_function'});
        			objActivity.description = result.getValue({name: 'custrecord_sr_activity_description', join: 'custrecord_sr_activity_function'});
        			objActivity.level = result.getValue({name: 'custrecord_sr_activity_level', join: 'custrecord_sr_activity_function'});
        			
        			objFunctions[sDepartment][idFunction].activities.push(objActivity);
    			}
    			
    			return true;
    		}
    		
    		return true;
    		//objActivities.push(objActivity);    		
    	});
    	
    	var srch = search.load({id: 'customsearch_funcmap_department'}); //**DO NOT EDIT/DELETE** Departments Search
    	
    	srch.run().each(function(result) {
            
    		var arrIdentifier = result.getValue({name: 'custrecord_sr_dept_identifier'}).split('.');
    		var sParent = '';
    		
    		if(arrIdentifier.length > 1){
    		
    			objDepartments.departments[arrIdentifier[0]].childs.push(
    					{	id: + result.id,
    						deptname: result.getValue({name: 'namenohierarchy'}),
    						owner: result.getText({name: 'custrecord_sr_dept_owner'}),
    						ownerimage: objEmpImage[result.getValue({name: 'image', join: 'custrecord_sr_dept_owner'})],
    						workplaceid: result.getValue({name: 'custentity_workplace_id', join: 'custrecord_sr_dept_owner'}),
    						identifier: result.getValue({name: 'custrecord_sr_dept_identifier'}),
    						functions: objFunctions[result.id] ? objFunctions[result.id] : {}
					});
    		}
    		else{
    			
    			objDepartments.departments[result.getValue({ name: 'custrecord_sr_dept_identifier'})] = 
    			{
    			id: + result.id,
    			deptid: 'id' + result.id, 
				deptname: result.getValue({name: 'namenohierarchy'}),
				owner: result.getText({name: 'custrecord_sr_dept_owner'}),
				ownerimage: objEmpImage[result.getValue({name: 'image', join: 'custrecord_sr_dept_owner'})],
				workplaceid: result.getValue({name: 'custentity_workplace_id', join: 'custrecord_sr_dept_owner'}),
				identifier: result.getValue({name: 'custrecord_sr_dept_identifier'}),
				functions: objFunctions[result.id] ? objFunctions[result.id] : {},
				childs: []
				};	
    		}
            return true;
        });
    	
    	objDepartments.departments.shift();
    	
    	var sHandlebar = handlebars.compile(sTemplate.getContents());
    	
    	handlebars.registerHelper('grouped_each', function(every, context, options) {
    	    var out = "", subcontext = [], i;
    	    
    	    if (context && context.length > 0) {
    	    	
    	        for (i = 0; i < context.length; i++) {
    	        	
    	            if (i > 0 && i % every === 0) {
    	                out += options.fn(subcontext);
    	                subcontext = [];
    	            }
    	            subcontext.push(context[i]);
    	        }
    	        out += options.fn(subcontext);
    	    }
    	    return out;
    	});
    	
    
    	var sHtmlTemplate = sHandlebar(objDepartments);

    	context.response.write(sHtmlTemplate);
    	
    	var objForm = serverWidget.createForm({title: 'ServiceRocket Departments'});
    	
    	var fldHtml = objForm.addField({
    	    id: 'custpage_htmlfield',
    	    type: serverWidget.FieldType.INLINEHTML,
    	    label: 'HTML Image'
    	});
    	fldHtml.defaultValue = sHtmlTemplate;
    	
    	//context.response.write(JSON.stringify(objDepartments));
    	context.response.writePage(objForm);
    }

	getAllResults = function(s) {
        var results = s.run();
        var searchResults = [];
        var searchid = 0;
        do {
            var resultslice = results.getRange({start:searchid,end:searchid+1000});
            resultslice.forEach(function(slice) {
                searchResults.push(slice);
                searchid++;
                }
            );
        } while (resultslice.length >=1000);
        return searchResults;
    } 
    
    return {
        onRequest: onRequest
    };
    
});
