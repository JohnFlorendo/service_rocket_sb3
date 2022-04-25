/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/file', 'N/search', 'N/record', 'N/ui/serverWidget', '../../Helper/nstojson', '../../Library/handlebars'],
/**
 * @param {file} file
 * @param {search} search
 */
function(file, search,  record, serverWidget, nstojson , handlebars) {
   
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
    	var paramReq = context.request.parameters;
    	var idRec = paramReq.jobid;
    	var sTemplate = file.load(135891);
    	
    	var recJobProfile = record.load({type: 'hcmjob', id: idRec, isDynamic: true});
    	var objFunction = {};
    	var objEmpImage = {};
    	var arrEmployees = [];
    	var objCompetencies = {};
    	
    	var srch = search.load({id: 'customsearch_funcmap_jobcompetency'}); //**DO NOT EDIT/DELETE** Job Competency Search
    	srch.filters = [];
    	//srch.filters.push(search.createFilter({name: 'custrecord_jc_job', operator: 'anyof', values: recJobProfile.getValue({fieldId: 'custrecord_sr_job'})}));
    	srch.filters.push(search.createFilter({name: 'custrecord_jc_job', operator: 'anyof', values: idRec}));
    	var res = getAllResults(srch);

    	res.forEach(function(result) {
    		
    		
			var objCompetency = {};
			var idCategory = result.getText({name: 'custrecord_sr_competency_category', join: 'custrecord_jc_competency'});
			objCompetency.id = result.getText({name: 'custrecord_jc_competency'});
			objCompetency.description = result.getValue({name: 'altname', join: 'custrecord_jc_competency'});
			objCompetency.skill = result.getValue({name: 'custrecord_comp_skill', join: 'custrecord_jc_competency'});
			objCompetency.level = result.getValue({name: 'custrecord_jc_level'});
			
    		if(objCompetencies[idCategory] == undefined){
    			objCompetencies[idCategory] = {name: result.getText({name: 'custrecord_sr_competency_category', join: 'custrecord_jc_competency'}), competencies: [objCompetency]};
    		}
    		else{
    			objCompetencies[idCategory].competencies.push(objCompetency);
    		}
    	});
    	
    	
    	var srch = search.load({id: 'customsearch_funcmap_functions'}); //**DO NOT EDIT/DELETE** Functions  Search
    	srch.filters = [];
    	srch.filters.push(search.createFilter({name: 'custrecord_sr_job', join: 'custrecord_sr_function_job', operator: 'anyof', values: idRec}));
    	var res = getAllResults(srch);
    	var sDepartment = '';
    	
    	res.forEach(function(result) {
    		
    		sDepartment = result.getText({name: 'custrecord_sr_function_department'});
    		var idFunction = result.id;
    		var sName = result.getValue({name: 'name'});
    		var sIdentifier = result.getValue({name: 'custrecord_sr_function_id'});
    		
			var objActivity = {};
			objActivity.id = result.getValue({name: 'internalid', join: 'custrecord_sr_activity_function'});
			objActivity.identifier = result.getValue({name: 'custrecord_sr_function_activity_id', join: 'custrecord_sr_activity_function'});
			objActivity.description = result.getValue({name: 'custrecord_sr_activity_description', join: 'custrecord_sr_activity_function'});
			objActivity.level = result.getValue({name: 'custrecord_sr_activity_level', join: 'custrecord_sr_activity_function'});
			
			if(result.getValue({name: 'internalid', join: 'custrecord_sr_activity_function'})){
				if(objFunction[idFunction] != undefined){
					objFunction[idFunction].activities.push(objActivity);
				}
				else{
					objFunction[idFunction] = {name: sName, identifier: sIdentifier, activities: []};
					objFunction[idFunction].activities.shift();
					objFunction[idFunction].activities.push(objActivity);
				}	
			}
			else{
				if(objFunction[idFunction] == undefined){
					objFunction[idFunction] = {name: sName, identifier: sIdentifier, activities: []};
				}
			}
    	});
    	
    	var srch = search.load({id: 'customsearch_funcmap_image'}); //**DO NOT EDIT/DELETE** Employee Image Search
    	var res = getAllResults(srch);

    	res.forEach(function(result) {
    		objEmpImage[result.id] = result.getValue({name: 'url'});
    	});
    	
    	
    	
    	var srch = search.load({id: 'customsearch_funcmap_employee'}); //**DO NOT EDIT/DELETE** Function Map Employee Search
    	srch.filters.push(search.createFilter({name: 'job', operator: 'anyof', values: idRec}));
    	var res = getAllResults(srch);

    	res.forEach(function(result) {
    		
    		var idEmployee = result.id;
    		var sName = result.getValue({name: 'entityid'});
    		
			var objEmployee = {};
			objEmployee.id = result.id;
			objEmployee.name = result.getValue({name: 'entityid'});
			objEmployee.location = result.getText({name: 'locationnohierarchy'});
			objEmployee.unit = result.getText({name: 'custentity4'});
			objEmployee.workplaceid = result.getValue({name: 'custentity_workplace_id'});
			objEmployee.image = objEmpImage[result.getValue({name: 'image'})];
			arrEmployees.push(objEmployee);
			
    	});
    	
    	
    	var objJobProfile = nstojson.get(recJobProfile);
    	objJobProfile.id = idRec;
    	objJobProfile.department = sDepartment;
    	objJobProfile.functions = objFunction;
    	objJobProfile.rocketeers = arrEmployees;
    	objJobProfile.competency = objCompetencies;
    	
    	var srch = search.load({id: 'customsearch_funcmap_jobrequisition'}); //**DO NOT EDIT/DELETE** Job Requisition Search
    	srch.filters = [];
    	srch.filters.push(search.createFilter({name: 'hcmjob', operator: 'anyof', values: idRec}));
    	var res = getAllResults(srch);

    	res.forEach(function(result) {
    		
    		var idJobReq = result.id;
    		var objJobReq = {
        		    id: idJobReq,
        		    title: result.getValue({
        		        name: 'title'
        		    }),
        		    class: result.getText({
        		        name: 'class'
        		    }),
        		    department: result.getText({
        		        name: 'department'
        		    }),
        		    manager: result.getText({
        		        name: 'hiringmanager'
        		    }),
        		    recruiter: result.getText({
        		        name: 'recruiter'
        		    }),
        		    description: result.getValue({
        		        name: 'postingdescription'
        		    }),
        		    status: result.getText({
        		        name: 'requisitionstatus'
        		    }),
        		    target: result.getValue({
        		        name: 'targethiredate'
        		    }),
        		    locations: result.getText({
        		        name: 'custrecord_hiringlocations'
        		    }),
        		    apply: result.getValue({
        		        name: 'custrecord_funcmap_refer'
        		    }),
        		    refer: result.getValue({
        		        name: 'custrecord_funcmap_apply'
        		    })
        		};
    		
    		if(objJobProfile.jobrequisition == undefined){
    			objJobProfile.jobrequisition = [objJobReq];
    		}
    		else{
    			objJobProfile.jobrequisition.push(objJobReq);
    		}
    	});

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
    	
    
    	var sHtmlTemplate = sHandlebar(objJobProfile);

    	context.response.write(sHtmlTemplate);
    	
    	var objForm = serverWidget.createForm({title: 'ServiceRocket Job Profile'});
    	
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
