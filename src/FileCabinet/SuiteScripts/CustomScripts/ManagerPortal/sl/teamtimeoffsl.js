/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/query', 'N/file', 'N/ui/serverWidget', '../api/lib/employee', '../api/timeoff' , '../../Library/handlebars'],
/**
 * @param {file} file
 * @param {serverWidget} serverWidget
 */
function(runtime, query, file, serverWidget, employee, timeoff, handlebars) {
   
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
    	var paramReq = context.request.parameters;
    	var sAction = paramReq.action;
    	var sTemplate = file.load(184710).getContents();
    	
    	if(sAction == 'backend'){

    		var results;
    		
    		if(sList == 'all'){
    			results = timeoff.getAllBallance(paramReq.idme);
    		}
    		else{
    			results = timeoff.getMyTeamBalance(paramReq.idme);
    		}
    		
    		context.response.write(JSON.stringify(results));
    	}
    	else{

    		var objForm = serverWidget.createForm({
        	    title: 'Manager Portal 1.1 (Barani)'
        	});
    		
        	var fldHtml = objForm.addField({
        	    id: 'custpage_htmlfield',
        	    type: serverWidget.FieldType.INLINEHTML,
        	    label: 'HTML'
        	});
    		
    		if(paramReq.manager){
    			idMe = parseInt(paramReq.manager);
    		}
    		
            var objFamily = employee.getFamily();
            
            var objDirect = employee.getDirectTeam({
                list: objFamily,
                key: 'id',
                value: idMe 
            });
            
            if(objDirect.ids.length > 1){
            	
            	var objBalance = timeoff.getMyTeamBalance(JSON.stringify(objDirect.ids).replace(/\[|\]/g,''));
               	
            	objBalance.balance.sort(function(a, b) {
                    var x = a['name']; var y = b['name'];
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                });
            	
            	var objTeamTimeOff = {month: JSON.stringify(objBalance.month), data: JSON.stringify(objBalance.balance)};
            	
            	var sHandlebar = handlebars.compile(sTemplate);
            	var sHtmlTemplate = sHandlebar(objTeamTimeOff);
            	
            	fldHtml.defaultValue = sHtmlTemplate;
            }

        	context.response.writePage(objForm);
    	}
    };

	groupBy =
		
	function (arr, prop) {
		
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

