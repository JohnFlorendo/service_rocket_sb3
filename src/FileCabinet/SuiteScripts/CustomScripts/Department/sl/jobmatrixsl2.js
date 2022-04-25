/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/file', 'N/search', 'N/record', 'N/ui/serverWidget', '../../Library/handlebars'],
/**
 * @param {file} file
 * @param {search} search
 * @param {serverWidget} serverWidget
 * custom modules
 * @param {handlebars} handlebars
 */
function(runtime, file, search, record, serverWidget, handlebars) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	
    	var idMe = runtime.getCurrentUser().id;
    	var idCareer = '';
    	var idMyJob = '';
    	var sMyJob = 'To be Selected';
    	var idTobe = [];
    	var idInterested = [];
    	var sTemplate = file.load(181315);
    	var sHandlebar = handlebars.compile(sTemplate.getContents());
    	
    	var src = search.create({
    	    type: 'customrecord_mycareer',
    	    columns: ['custrecord_myc_thisisme', 'custrecord_myc_workingtobe', 'custrecord_myc_iamiterested'],
    	    filters: ['custrecord_myc_employee', 'anyof', idMe]
    	});
    	var res = src.run().getRange({
    	    start: 0,
    	    end: 1
    	});

    	if (res.length > 0) {
    		
    		idCareer = res[0].id;

    	    rec = record.load({
    	        type: 'customrecord_mycareer',
    	        id: idCareer
    	    });
    	    
    	    idMyJob = rec.getValue('custrecord_myc_thisisme');
    	    sMyJob = rec.getText('custrecord_myc_thisisme');
    	    idTobe = rec.getValue('custrecord_myc_workingtobe');
    	    idInterested = rec.getValue('custrecord_myc_iamiterested');
    	    
    	} 
    	else {
    	    rec = record.create({
    	        type: 'customrecord_mycareer'
    	    });
    	    
    	    rec.setValue({
    	        fieldId: 'custrecord_myc_employee',
    	        value: idMe
    	    });
    	    
    	    idCareer = rec.save();
    	}
		
    	handlebars.registerHelper('if_even',
			    function (conditional) {

			    if ((conditional % 2) == 0) {
			        return 'bg-light';
			    } else {
			        return '';
			    }
			});
		
    	//X Level
    	var srch = search.load({
    	    id: 'customsearch_joblevel_matrix_2' //Job Level Search Matrix 2
    	});
    	
    	var arrColumns = [''];
    	var arrData = [];
    	arrData.push(arrColumns);
    	var idxColumn = 0;
    	var res = getAllResults(srch);
    	var nColumnLen = res.length; 

    	res.forEach(function (result) {

    		idxColumn ++;
   		
    	    arrData[0][idxColumn] = result.getValue({
    	        name: 'custrecord_sr_job_level_number'
    	    }) + ': ' + result.getValue({
    	        name: 'name'
    	    });
    	});
    	
    	//Y Level
    	var srch = search.load({
    	    id: 'customsearch_jobfamily_matrix'//Job Family Search - Matrix
    	});
    	
    	var res = getAllResults(srch);
    	var nRowLen = res.length;
    	
    	res.forEach(function (result) {

    		var arrRowData = [result.getValue({
    	        name: 'name'
        	    }) + ' ' + result.getValue({
        	        name: 'altname'
        	    })];
    		
    		for (var nColumn = 1; nColumn <= nColumnLen; nColumn++) {
    			arrRowData.push([]);
			}
    		
    	    arrData.push(arrRowData);
    	});
    	nRowLen += 1;
    	
    	//Has Job Requisition
    	var srch = search.load({
    	    id: 'customsearch_jobreq_count'
    	});
    	
    	var objJobOpenings = {};
    	
    	var res = getAllResults(srch);
    	
    	res.forEach(function (result) {

    		objJobOpenings[result.getValue({
    	            name: 'hcmjob',
    	            summary: search.Summary.GROUP
    	        })] =

    	        result.getValue({
    	        name: 'internalid',
    	        summary: search.Summary.COUNT
    	    });

    	});
    	
    	//Data Level
    	var srch = search.load({
    	    id: 'customsearch_jobprofilelevel_matrix' //Job Profile Level Search Matrix
    	});
    	
    	var res = getAllResults(srch);
    	
    	res.forEach(function (result) {
    		
    		var bOpening = false;
    		var sCareerMe = '';
    		var sWorking = '';
    		var sInterested = '';
    		
    		var idJob = result.getValue({
		        name: 'jobid',
		        join: 'custrecord_jpl_jobprofile'
		    });

    		var nColumn =result.getValue({
                name: 'custrecord_sr_y_index',
                join: 'custrecord_jpl_joblevel'
            });
            
    		var nRow =  parseInt(result.getValue({
    			name: 'formulanumeric'
            }), 10);
            
            var nOpenings = objJobOpenings[result.getValue({
                name: 'custrecord_jpl_jobprofile'
            })];
            
            
    		if(idJob == idMyJob){
    			sCareerMe = 'checked';
    		}
    		
    		if(idJob == idTobe){
    			sWorking = 'checked';
    		}
            
    		if(idInterested.indexOf(idJob) > -1){
    			sInterested = 'checked';
    		}
    		
            var hasResponsibility = false;
            
            if(result.getValue({
		        name: 'custrecord_sr_job_responsibilities',
		        join: 'custrecord_jpl_jobprofile'
		    }) != '' && result.getValue({
		        name: 'custrecord_sr_job_responsibilities',
		        join: 'custrecord_jpl_jobprofile'
		    }) != null && result.getValue({
		        name: 'custrecord_sr_job_responsibilities',
		        join: 'custrecord_jpl_jobprofile'
		    })){
            	hasResponsibility = true;
            }
            
            var hasQualification = false;
            
            if(result.getValue({
		        name: 'custrecordsr_job_qualifications',
		        join: 'custrecord_jpl_jobprofile'
		    }) != '' && result.getValue({
		        name: 'custrecordsr_job_qualifications',
		        join: 'custrecord_jpl_jobprofile'
		    }) != null && result.getValue({
		        name: 'custrecordsr_job_qualifications',
		        join: 'custrecord_jpl_jobprofile'
		    })){
            	hasQualification = true;
            }
            
            var hasSkills = false;
            
            if(result.getValue({
		        name: 'custrecord_sr_job_skills',
		        join: 'custrecord_jpl_jobprofile'
		    }) != '' && result.getValue({
		        name: 'custrecord_sr_job_skills',
		        join: 'custrecord_jpl_jobprofile'
		    }) != null && result.getValue({
		        name: 'custrecord_sr_job_skills',
		        join: 'custrecord_jpl_jobprofile'
		    })){
            	hasSkills = true;
            }
            
            if(nOpenings > 0){
            	bOpening = true;
            }
            
            var isIndividual = ''; 
            	
            if(result.getValue({
                name: 'custrecord_sr_career_track',
                join: 'custrecord_jpl_joblevel'
            }) == 1 ){
            	isIndividual = 'bg-white';
            }
            	 
			var objJobProfile = {
				    name: result.getText({
				        name: 'custrecord_jpl_jobprofile'
				    }),
				    id: idJob,
				    opening: bOpening,
				    responsibility: hasResponsibility,
				    qualification: hasQualification,
				    skill: hasSkills,
				    careerme: sCareerMe,
				    working: sWorking,
				    interested: sInterested,
				    careertrack: isIndividual
				};
    	    
			try{
				arrData[nRow][nColumn].push(objJobProfile);	
			}
			catch(err){
				var error = err;
			}
    	    
    	});

    	//var sHtmlTemplate = sHandlebar(arrData);
    	var sHtmlTemplate = sHandlebar({mycareer: idCareer, list: arrData, myjob: idMyJob, myjobname: sMyJob});
    	
    	var objForm = serverWidget.createForm({
    	    title: 'Career Pathways'
    	});
    	
    	var fldHtml = objForm.addField({
    	    id: 'custpage_htmlfield',
    	    type: serverWidget.FieldType.INLINEHTML,
    	    label: 'HTML Image'
    	});
    		fldHtml.defaultValue = sHtmlTemplate;

    	context.response.writePage(objForm);
    }

	getAllResults = function (s) {
	    var results = s.run();
	    var searchResults = [];
	    var searchid = 0;
	    do {
	        var resultslice = results.getRange({
	            start: searchid,
	            end: searchid + 1000
	        });
	        resultslice.forEach(function (slice) {
	            searchResults.push(slice);
	            searchid++;
	        });
	    } while (resultslice.length >= 1000);
	    return searchResults;
	}
    
    return {
        onRequest: onRequest
    };
    
});
