define(['N/query'],

function(query) {
   
	get = function(option){
		
		var retMe;
//		
//        var qry = query.load({
//            id: 'custdataset_timeoffchange_raw'
//        });
//       
//        qry.condition = qry.and(
//        		qry.condition
//        		, qry.createCondition({
//		        	fieldId: 'employee',
//		            operator: query.Operator.ANY_OF,
//		            values: [option]})
//		       );
//        
//        qry.columns = [qry.createColumn({
//				            type: 'STRING',
//				            formula: "TO_CHAR({dateapplied}, 'YYYY.MM')",
//				            groupBy: true,
//				            alias: 'month'
//				        })
//				      ,qry.createColumn({
//				            fieldId: 'employee',
//				            groupBy: true,
//				            context: {
//				            	name: query.FieldContext.DISPLAY
//				            },
//				            alias: 'name'
//				        })
//				      , qry.createColumn({
//				    	    //fieldId: 'usage',
//				            type: 'FLOAT',
//				            formula: "CASE ({timeoffchangetype#display}) WHEN 'Usage' THEN ABS({amount}) ELSE 0 END",
//				            aggregate: query.Aggregate.SUM,
//				            alias: 'usage'
//				        })
//				      , qry.createColumn({
//				            type: 'FLOAT',
//				            formula: "CASE ({timeoffchangetype#display}) WHEN 'Manual Increase' THEN {amount} WHEN 'Accrual' THEN {amount} ELSE 0 END",
//				            aggregate: query.Aggregate.SUM,
//				            alias: 'accrual'
//				        })
//				      , qry.createColumn({
//				    	  	type: 'FLOAT',
//				            fieldId: 'amount',
//				            aggregate: query.Aggregate.SUM,
//				            alias: 'total'
//				            
//				        })
//				      ];
//        
//        qry.sort = [
//                    qry.createSort({
//                        column: qry.columns[0]
//                    })
//                ];
        
        var sql = "SELECT BUILTIN_RESULT.TYPE_STRING(TO_CHAR(TimeOffChange.dateapplied, 'YYYY.MM')) AS month , BUILTIN_RESULT.TYPE_STRING(BUILTIN.DF(TimeOffChange.employee)) AS employee,   BUILTIN_RESULT.TYPE_FLOAT(SUM(CASE BUILTIN.DF(TimeOffChange.timeoffchangetype) WHEN 'Usage' THEN ABS(TimeOffChange.amount) ELSE 0 END)) AS usage,   BUILTIN_RESULT.TYPE_FLOAT(SUM(CASE BUILTIN.DF(TimeOffChange.timeoffchangetype) WHEN 'Manual Increase' THEN TimeOffChange.amount WHEN 'Accrual' THEN TimeOffChange.amount ELSE 0 END)) AS accrual,   BUILTIN_RESULT.TYPE_FLOAT(SUM(TimeOffChange.amount)) AS total FROM   TimeOffChange,   TimeOffType WHERE   TimeOffChange.timeofftype = TimeOffType.\"ID\"(+)  AND ((((NOT(  UPPER(TimeOffChange.timeoffchangetype) IN ('CARRYOVER', 'YEAR_END_EXPIRY')  ) OR UPPER(TimeOffChange.timeoffchangetype) IS NULL) AND UPPER(TimeOffType.name) IN ('ANNUAL LEAVE (PTO)', 'US ANNUAL LEAVE (PTO)', 'US ANNUAL LEAVE (PTO) WAGE')) AND TimeOffChange.employee IN ('" + option + "'))) GROUP BY   TO_CHAR(TimeOffChange.dateapplied, 'YYYY.MM'),   BUILTIN.DF(TimeOffChange.employee) ORDER BY   UPPER(TO_CHAR(TimeOffChange.dateapplied, 'YYYY.MM')) ASC NULLS LAST";        
        
        
        var arrTimeoff = query.runSuiteQL(sql).asMappedResults();
        
        arrTimeoff.forEach(function (timeoff, idx, arrtimeoff) {
        	
        	if(idx == 0){
        		arrtimeoff[idx].balance = arrtimeoff[idx].total;
        	}
        	else{
        		arrtimeoff[idx].balance = arrtimeoff[idx].total + arrtimeoff[idx-1].balance;
        	}
        	
        });
        
        retMe = {data: arrTimeoff};
		
		return retMe;
		
	};

    return {
    	get: get
    };
    
});
