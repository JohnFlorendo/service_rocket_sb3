define(['N/query', 'N/file'],

function(query, file) {
	
	getMine = function(option) {
		
		
		var sqlTimeOffRequest = file.load(195352).getContents();//mytimeoffrequest.sql
//        var arrTimeoff = query.runSuiteQL({
//        							query: file.load(233184).getContents(), //ptomontlyhistory.sql
//        							params: [option.id]
//        						}).asMappedResults();
                
		var arrTimeoff = query.runSuiteQL({
								query: file.load({
									id: 233184 //ptomontlyhistory.sql
								}).getContents().replace(/{{id}}|{{hrmanager}}|{{manager}}/g, 
												function(s){
													return option[s];
												}),
								//params: [idMe]
							}).asMappedResults();
        
//        var arrTimeoffRequest = query.runSuiteQL({
//											query: file.load(195352).getContents().replace('{{id}}', option.id), //ptorequests.sql
//											//params: [option]
//		        						}).asMappedResults();
        var arrTimeoffRequest = query.runSuiteQL({
											query: file.load({
												id: 195352 //ptorequests.sql'
											}).getContents().replace(/{{id}}|{{hrmanager}}|{{manager}}/g, 
															function(s){
																return option[s];
															}),
											//params: [idMe]
										}).asMappedResults();
        
        
        arrTimeoff.forEach(function (timeoff, idx, arrtimeoff) {
        	
        	var nPending = 0;
        	
			var objPending = arrTimeoffRequest.filter(function(request) {
				return request.month == timeoff.month;
			});
        	
			if(objPending.length > 0){
				nPending = 0-objPending[0].amount;
			}
        	
        	if(idx == 0){
        		arrtimeoff[idx].balance = arrtimeoff[idx].total;
        		arrtimeoff[idx].pending = nPending;
       			arrtimeoff[idx].projected = null;
        	}
        	else{
        		arrtimeoff[idx].balance = arrtimeoff[idx].total + arrtimeoff[idx-1].balance;
        		arrtimeoff[idx].pending = nPending;
        		
        		if(objPending.length){
        			
        			if(arrtimeoff[idx-1].projected == null){
        				arrtimeoff[idx-1].projected = arrtimeoff[idx-1].balance;
        				arrtimeoff[idx].projected = arrtimeoff[idx].balance + nPending;	
        			}
        			else{
        				arrtimeoff[idx].projected = arrtimeoff[idx-1].projected + arrtimeoff[idx].accrual - arrtimeoff[idx].usage + nPending ;	
        			}
        		}
        		else if(arrtimeoff[idx-1].projected != null){
        			arrtimeoff[idx].projected = arrtimeoff[idx-1].projected + arrtimeoff[idx].accrual - arrtimeoff[idx].usage + nPending  ;	
        		}
        		else{
        			arrtimeoff[idx].projected = null;
        		}
        	}
        	
        });
        
        retMe = {data: arrTimeoff};
		
		return retMe;
	};
	
	getMyTeam = function(option) {
		
		var retMe;
		
        var sql = "SELECT BUILTIN_RESULT.TYPE_STRING(TO_CHAR(TimeOffChange.dateapplied, 'YYYY.MM')) AS month , BUILTIN_RESULT.TYPE_STRING(BUILTIN.DF(TimeOffChange.employee)) AS employee,   BUILTIN_RESULT.TYPE_FLOAT(SUM(CASE BUILTIN.DF(TimeOffChange.timeoffchangetype) WHEN 'Usage' THEN ABS(TimeOffChange.amount) ELSE 0 END)) AS usage,   BUILTIN_RESULT.TYPE_FLOAT(SUM(CASE BUILTIN.DF(TimeOffChange.timeoffchangetype) WHEN 'Manual Increase' THEN TimeOffChange.amount WHEN 'Accrual' THEN TimeOffChange.amount ELSE 0 END)) AS accrual,   BUILTIN_RESULT.TYPE_FLOAT(SUM(TimeOffChange.amount)) AS total FROM   TimeOffChange,   TimeOffType WHERE   TimeOffChange.timeofftype = TimeOffType.\"ID\"(+)  AND ((((NOT(  UPPER(TimeOffChange.timeoffchangetype) IN ('CARRYOVER', 'YEAR_END_EXPIRY')  ) OR UPPER(TimeOffChange.timeoffchangetype) IS NULL) AND UPPER(TimeOffType.name) IN ('ANNUAL LEAVE (PTO)', 'US ANNUAL LEAVE (PTO)', 'US ANNUAL LEAVE (PTO) WAGE')) AND TimeOffChange.employee IN (" + option + "))) GROUP BY   TO_CHAR(TimeOffChange.dateapplied, 'YYYY.MM'),   BUILTIN.DF(TimeOffChange.employee) ORDER BY   UPPER(TO_CHAR(TimeOffChange.dateapplied, 'YYYY.MM')) ASC NULLS LAST";        
        
        var arrTimeOffs = query.runSuiteQL(sql).asMappedResults();
        
        var objStorage = {};
        
        arrTimeOffs.forEach(function (timeoff, idx, arrtimeoff) {
        	
        	if(idx == 0){
        		arrtimeoff[idx].balance = arrtimeoff[idx].total;
        		objStorage[timeoff.employee] = idx;
        	}
        	else{
        		
        		if(objStorage.hasOwnProperty(timeoff.employee)){
        			
        			var idxPrev = objStorage[timeoff.employee];
        			arrtimeoff[idx].balance = arrtimeoff[idx].total + arrtimeoff[idxPrev].balance;
        			objStorage[timeoff.employee] = idx;
        		}
        		else{
        			
        			arrtimeoff[idx].balance = arrtimeoff[idx].total;
        			objStorage[timeoff.employee] = idx;
        		}
        	}
        	
        });
        
    	var d = new Date();
    	var sMonth = d.getFullYear()+ "." + ("0"+(d.getMonth()+1)).slice(-2);
    	
		var arrGroupedMonth = groupBy(arrTimeOffs, 'month');
		var arrGroupedEmployee = groupBy(arrTimeOffs, 'employee');
		
		var arrMonths = [];
		for (var key in arrGroupedMonth) {
        	arrMonths.push(key);
        }
		
    	var nIdx = arrMonths.indexOf(sMonth);
    	var sTart = nIdx -5;
    	arrMonths.splice(0, sTart);
    	arrMonths.splice(18, arrMonths.length);
		
    	for (key in arrGroupedMonth){
    		
    		if(arrMonths.indexOf(key) == -1){
    			delete arrGroupedMonth[key]
    		}
    		
    	}
		
    	var arrEmployees = [];
    	for (var key in arrGroupedEmployee) {
    		arrEmployees.push(key);
    	}
		
        var arrGroupedEmployee = groupBy(arrTimeOffs, 'employee');
		
		var arrBalance = [];
		
		
		arrEmployees.forEach(function (employee) {
	            	
			var objBalance = { name: employee, type: 'spline', colorIndex: arrBalance.length + 1,
	    	        data: [],
	    	        tooltip: {
	    	            valueSuffix: ' hours'
	    	        }};
			
			for (var key in arrGroupedMonth) {

				var arrMonth = arrGroupedMonth[key];
				var objMonth = arrMonth.filter(function(month) {
						return month.employee == employee;
				});
				
				if(objMonth.length > 0){
					objBalance.data.push(parseFloat((objMonth[0].balance).toFixed(2)));
				}
				else{
					objBalance.data.push(0);
				}
			}
			
			arrBalance.push(objBalance);
		});

        retMe = {month: arrMonths, balance: arrBalance};
		
		return retMe;
		
	};
   
	getDirectTeam = function(option){
		
		var retMe;
		
        var qry = query.load({
            id: 'custdataset_timeoffraw'
        });
       
        qry.condition = qry.and(
        		qry.condition
        		, qry.createCondition({
		        	fieldId: 'employee.supervisor',
		            operator: query.Operator.ANY_OF,
		            values: [option]})
		       , qry.createCondition({
		    	   	fieldId: 'timeofftype',
		    	   	operator: query.Operator.ANY_OF,
		    	   	values: ['1', '9', '13']})
		    	   	
		       );
        
        qry.columns = [qry.createColumn({
				            component: {
				                type: 'timeoffchange'
				            },
				            type: 'STRING',
				            formula: '{employee#display}',
				            groupBy: true
				        })
				      , qry.createColumn({
				            component: {
				                type: 'timeoffchange'
				            },
				            type: 'STRING',
				            formula: '{employee.supervisor#display}',
				            groupBy: true
				        })
				      , qry.createColumn({
				            fieldId: 'amount',
				            aggregate: query.Aggregate.SUM
				        })
				      ];
        
        retMe = {data: query.runSuiteQL(qry.toSuiteQL().query).asMappedResults()};
		
		return retMe;
		
	};
	
	getAll = function(option){
		
		var retMe;
		
        var qry = query.load({
            id: 'custdataset_timeoffraw'
        });
       
        qry.condition = qry.and(
        		qry.condition,
        		qry.createCondition({
		        	fieldId: 'employee',
		            operator: query.Operator.ANY_OF,
		            values: option.id})
		       , qry.createCondition({
		    	   	fieldId: 'timeofftype',
		    	   	operator: query.Operator.ANY_OF,
		    	   	values: ['1', '9', '13']})
		       );
        
        qry.columns = [qry.createColumn({
				            component: {
				                type: 'timeoffchange'
				            },
				            type: 'STRING',
				            formula: '{employee#display}',
				            groupBy: true
				        })
				      , qry.createColumn({
				            component: {
				                type: 'timeoffchange'
				            },
				            type: 'STRING',
				            formula: '{employee.supervisor#display}',
				            groupBy: true
				        })
				      , qry.createColumn({
				            fieldId: 'amount',
				            aggregate: query.Aggregate.SUM
				        })
				      ];
        
        retMe = query.runSuiteQL(qry.toSuiteQL().query).asMappedResults();
		
		return {data: retMe};
		
	};
		
	getBalances = function(option) {
		
		var arrSql = file.load(204425).getContents().split('{{}}');//timeoffbalances.sql
		
		var objResult = query.runSuiteQL(arrSql[option.type].replace('{{id}}', option.id)).asMappedResults();
		
		return objResult;
		
	};
	
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
    	getMine: getMine,
    	getBalances: getBalances,
    	getMyTeam: getMyTeam,
    	getDirectTeam: getDirectTeam,
    	getAll: getAll
    };
    
});
