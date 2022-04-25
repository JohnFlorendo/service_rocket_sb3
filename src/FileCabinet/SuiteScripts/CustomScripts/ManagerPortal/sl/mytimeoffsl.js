/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/query', 'N/file', 'N/ui/serverWidget', '../api/timeoff', '../../Library/handlebars'],
/**
 * @param {file} file
 * @param {serverWidget} serverWidget
 */
function(runtime, query, file, serverWidget, timeoff, handlebars) {
   
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
		var idHrManager = paramReq.hrmanager ? paramReq.hrmanager : 0;
		var idManager = paramReq.manager ? paramReq.manager : 0;
    	var sAction = paramReq.action;
    	var sTemplate = file.load(204325).getContents();//183689
    	
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
    		
//    		if(idMe == 171596 || idMe == -5){
//    			if(paramReq.employee){
//    				idMe = paramReq.employee;
//    			}
//        	}
//    		else 
    		if (idHrManager > 0 && idMe == idHrManager){
				idMe = paramReq.employee;
			}
			else if (idManager > 0 && idMe == idManager){
				idMe = paramReq.employee;
			}
    		
			var objSqlParams = {
					'{{id}}' :  idMe,
					'{{hrmanager}}': idHrManager,
					'{{manager}}': idManager};
			
        	var arrTimeOffs = timeoff.getMyTimeOffBalance(objSqlParams);
        	
        	var arrMonths = arrTimeOffs.data.map(function(a) {return a.month;});
    		var arrUsage = arrTimeOffs.data.map(function(a) {return parseFloat((0 - a.usage).toFixed(2));});
    		var arrAccrual = arrTimeOffs.data.map(function(a) {return parseFloat((a.accrual).toFixed(2));});
    		var arrBalance = arrTimeOffs.data.map(function(a) {return parseFloat((a.balance).toFixed(2));});
    		var arrPending = arrTimeOffs.data.map(function(a) {return parseFloat((a.pending).toFixed(2));});
    		var arrProjected = arrTimeOffs.data.map(function(a) {return parseFloat(a.projected ? (a.projected).toFixed(2) : null);});
    		
        	var d = new Date();
        	var sMonth = d.getFullYear()+ "." + ("0"+(d.getMonth()+1)).slice(-2);
        	var nIdx = arrMonths.indexOf(sMonth);
        	var sTart = nIdx -5;
        	arrMonths.splice(0, sTart);
        	arrMonths.splice(18, arrMonths.length);
        	arrUsage.splice(0, sTart);
        	arrUsage.splice(18, arrUsage.length);
        	arrAccrual.splice(0, sTart);
        	arrAccrual.splice(18, arrAccrual.length);
        	arrBalance.splice(0, sTart);
        	arrBalance.splice(18, arrBalance.length);
        	arrPending.splice(0, sTart);
        	arrPending.splice(18, arrPending.length);
        	arrProjected.splice(0, sTart);
        	arrProjected.splice(18, arrProjected.length);
        	
        	//Math.max.apply(Math, array.map(function(o) { return o.y; })) < 100
        	
        	arrBalance[5] ={
                y: arrBalance[5],
                marker: {
                    symbol: 'url(https://assets.website-files.com/5417148fa48c4dae190c9b0e/54370b13267f6c5d24dcfc25_256-square.png)',
                    width: 32, height: 32,
                    enabled: true
                }
            };
        	
        	var objMyTimeOff = {
        			name: arrTimeOffs.data[0].employee,
        			months: JSON.stringify(arrMonths),
        			usage: JSON.stringify(arrUsage),
        			accrual: JSON.stringify(arrAccrual),
        			balance: JSON.stringify(arrBalance),
        			pending: JSON.stringify(arrPending),
        			projected: JSON.stringify(arrProjected),
        			balances : timeoff.getMyTimeOffBalances({id: idMe, type:  0})
        	};
        	
    		var objForm = serverWidget.createForm({
        	    title: 'MyPTO (1.2)'
        	});
    		
        	var fldHtml = objForm.addField({
        	    id: 'custpage_htmlfield',
        	    type: serverWidget.FieldType.INLINEHTML,
        	    label: 'HTML Image'
        	});
        	
        	var sHandlebar = handlebars.compile(sTemplate);
        	
        	
        	handlebars.registerHelper('currency', function (value) {
    		    return value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    		});
        	
        	var sHtmlTemplate = sHandlebar(objMyTimeOff);
        	
        	fldHtml.defaultValue = sHtmlTemplate;

        	context.response.writePage(objForm);
    	}
    }

    return {
        onRequest: onRequest
    };
    
});

