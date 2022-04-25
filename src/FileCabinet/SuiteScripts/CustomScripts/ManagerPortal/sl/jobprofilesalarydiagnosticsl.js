/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/file', 'N/query', '../../Library/handlebars'],
/**
 * @param {file} file
 * @param {query} query
 */
function(serverWidget, file, query, handlebars) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {

    	var sTemplate = file.load(195862).getContents();
    	var sql = file.load(195860).getContents();

		var objForm = serverWidget.createForm({
    	    title: 'Job Profile Salary Diagnostic'
    	});
		
		var fldDate = objForm.addField({
    	    id: 'custpage_effectivedate',
    	    type: serverWidget.FieldType.SELECT,
    	    label: 'Effective Date'
    	});

		fldDate.addSelectOption({
		    value : 'pleaseselect',
		    text : 'Please Select'
		});
		fldDate.addSelectOption({
		    value : '2021-09-15',
		    text : '2021-09-15'
		});
		fldDate.addSelectOption({
		    value : '2022-09-15',
		    text : '2022-09-15'
		});
		
		var fldSource = objForm.addField({
    	    id: 'custpage_source',
    	    type: serverWidget.FieldType.SELECT,
    	    label: 'Source'
    	});
		
		fldSource.addSelectOption({
		    value : 'pleaseselect',
		    text : 'Please Select'
		});
		fldSource.addSelectOption({
		    value : 'Internal - Baseline',
		    text : 'Internal - Baseline'
		});
		fldSource.addSelectOption({
		    value : 'External - First Person Advisors',
		    text : 'External - First Person Advisors'
		});
		
    	var fldHtml = objForm.addField({
    	    id: 'custpage_htmlfield',
    	    type: serverWidget.FieldType.INLINEHTML,
    	    label: 'HTML Image'
    	});

        log.audit({
            title: 'sql',
            details: sql
        });
    	
    	//sql = "SELECT entityid as name , hcmjob.id AS jobid , CONCAT(CONCAT(CONCAT(hcmjob.title, '('), hcmjob.id), ')') as title , customrecord_sr_job_family.id AS jobfamilyid , CONCAT(CONCAT(BUILTIN.DF(custrecord_sr_job_family), ' '), customrecord_sr_job_family.altname) AS jobfamily , customrecord_sr_job_profile_level.custrecord_jpl_joblevel AS level, , compensationcurrency AS currency , custentity_st_total_annual_compensation AS totalcompen , customrecord_sr_job_salary_range.name AS salaryrange , customrecord_sr_job_salary_range.custrecord_sr_range_low AS low , customrecord_sr_job_salary_range.custrecord_sr_range_high AS high FROM employee , hcmjob , customrecord_sr_job_profile_level , customrecord_sr_job_family , customrecord_sr_job_salary_range WHERE employee.job = hcmjob.id AND hcmjob.id = customrecord_sr_job_profile_level. custrecord_jpl_jobprofile AND employee.job = customrecord_sr_job_salary_range.custrecord_sr_job_profile AND employee.currency = customrecord_sr_job_salary_range.custrecord_salary_range_currency AND hcmjob.custrecord_sr_job_family = customrecord_sr_job_family.id AND customrecord_sr_job_salary_range.custrecord_sr_effective_date = '2021-09-22' AND employee.isinactive = 'F'";
    	var arrDiagnostic = query.runSuiteQL(sql).asMappedResults();
    	var arrGroupDiagnostic = [];
    	var objGroupCurrency = groupBy(arrDiagnostic, 'currency');
    	
    	for (var key in objGroupCurrency) {
    		
    		var sCurr = key;
    		var arrCurrencyData = objGroupCurrency[key];
    		var objGroupDiagnostic = groupBy(arrCurrencyData, 'jobfamily');

    		for (var key in objGroupDiagnostic) {
    			
    			var arrData = objGroupDiagnostic[key];
    			var objGroupJob = groupBy(arrData, 'title');
    			var idFamily = 1;
    			var sChartId = key.split(' ')[0];
    			var arrSeries = [];

    			arrData.forEach(function (data) {
    				
    				idFamily = data.jobfamilyid;
    				arrSeries.push({
    					name: data.name,
    					title: data.title,
    					compen: data.totalcompen
    				});
    			});
    			
    			var arrGroupJob = [];
    			for (var key in objGroupJob) {
    				
    				var arrData = objGroupJob[key];
    				
    				arrGroupJob.push({
    					name: key,
    					level: arrData[0].level,
    					low: arrData[0].low,
    					high: arrData[0].high
    				});
    			}
    			
    			arrGroupJob.sort(function(a, b) {
    	            var x = a['level']; var y = b['level'];
    	            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    	        });
    			
    			arrGroupDiagnostic.push({
    				id: idFamily,
    				chart: sChartId + sCurr,
    				currency: sCurr,
    				family: sChartId,
    				series: arrSeries,
    				range: JSON.stringify(arrGroupJob)
    			});
            }
    	}
    	
    	arrGroupDiagnostic.sort(function(a, b) {
            var x = a['family']; var y = b['family'];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
		
		
    	var sHandlebar = handlebars.compile(sTemplate);
    	var sHtmlTemplate = sHandlebar(arrGroupDiagnostic);
    	
    	fldHtml.defaultValue = sHtmlTemplate;

    	context.response.writePage(objForm);
    }

    groupBy = function (arr, prop) {
    		
    		return arr.reduce(function (a, b) {
    			var key = b[prop];
    			if (!a[key]) {
    			  a[key] = [];
    			}
    			a[key].push(b);
    			return a;
    		  }, {});	
    };
    
    return {
        onRequest: onRequest
    };
    
});
