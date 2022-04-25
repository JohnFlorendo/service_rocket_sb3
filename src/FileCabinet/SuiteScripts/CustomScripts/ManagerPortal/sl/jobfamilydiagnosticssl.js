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

    	var sTemplate = file.load(193307).getContents();
    	var sql = file.load(193407).getContents();

		var objForm = serverWidget.createForm({
    	    title: 'Job Family Diagnostic'
    	});
		
    	var fldHtml = objForm.addField({
    	    id: 'custpage_htmlfield',
    	    type: serverWidget.FieldType.INLINEHTML,
    	    label: 'HTML Image'
    	});

    	var arrDiagnostic = query.runSuiteQL(sql).asMappedResults();
    	var arrGroupDiagnostic = [];
    	var arrGroupDiagnostic0 = [];
    	
    	var objGroupCurrency = groupBy(arrDiagnostic, 'currency');
    	
    	for (var key in objGroupCurrency) {
    		
    		var sCurr = key;
    		var arrCurrencyData = objGroupCurrency[key];
    		
    		var objGroupDiagnostic0 = groupBy(arrCurrencyData, 'jobfamily');

    		for (var key in objGroupDiagnostic0) {
    			
    			var arrData = objGroupDiagnostic0[key];
    			var idFamily = 1;
    			var sChartId = key.split(' ')[0];
    			var arrSeries = [];
    			
    			arrData.forEach(function (data) {
    				
    				idFamily = data.jobfamilyid;
    				var objSeries = {
    					name: data.name + ' ' + data.title + '(' + data.jobid+')',
    					data: [[data.level, data.totalcompen]]
    				}
    				
    				arrSeries.push(objSeries);
    			});
    			
        		arrGroupDiagnostic0.push({
    				id: idFamily,
    				chart: sChartId + sCurr,
    				currency: sCurr,
    				family: key,
    				series: JSON.stringify(arrSeries)
    			});
            }
    	}
    	
//    	var objGroupDiagnostic = groupBy(arrDiagnostic, 'jobfamily');
//
//    	for (var key in objGroupDiagnostic) {
//			
//			var arrData = objGroupDiagnostic[key];
//			var idFamily = 1;
//			var sCurr = '';
//			var sChartId = key.split(' ')[0];
//			var arrSeries = [];
//			
//			arrData.forEach(function (data) {
//				
//				idFamily = data.jobfamilyid;
//				sCurr = data.currency;
//				var objSeries = {
//					name: data.name + ' ' + data.title + '(' + data.jobid+')',
//					data: [[data.level, data.totalcompen]]
//				}
//				
//				arrSeries.push(objSeries);
//			});
//			
//			arrGroupDiagnostic.push({
//				id: idFamily,
//				chart: sChartId + sCurr,
//				currency: sCurr,
//				family: key,
//				series: JSON.stringify(arrSeries)
//			});
//        }
		
		arrGroupDiagnostic0.sort(function(a, b) {
            var x = a['family']; var y = b['family'];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
		
		
    	var sHandlebar = handlebars.compile(sTemplate);
    	var sHtmlTemplate = sHandlebar(arrGroupDiagnostic0);
    	
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
