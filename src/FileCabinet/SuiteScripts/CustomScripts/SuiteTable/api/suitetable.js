define(['N/record', 'N/query', 'N/file'],

function(record, query, file) {
	
	getData = function(option){
		
		var arrHeader = [];
		var arrGroup = [];
		var arrHide = [];
		var arrTrunc = [];
		var arrNum = [];
		var arrLink = [];
		var arrCurrency = [];
		
		var sSql = file.load({
			id: option.sqlfile
		}).getContents();
		
		
        log.audit({
            title: 'id',
            details: sSql
        });
		
        if(option.custparam){
        	
        	var custParam = option.custparam;
        	var regx = new RegExp(Object.keys(custParam).join("|"),"gi");
            sSql = sSql.replace(regx, function(matched){
      		  return custParam[matched];
      		});
        }
        
        
		var arrRawData = query.runSuiteQL({
			query: sSql,
			params: option.params
		}).asMappedResults();

		if(arrRawData.length > 0){
	
			var index = 0;
			
			for (var key in arrRawData[0]) {
				
				if (key.indexOf('_grouped') > -1) {
					arrGroup.push(index);
					arrHide.push(index);
			    }
				
				if (key.indexOf('_hide') > -1) {
					arrHide.push(index);
			    }
				
				if (key.indexOf('_truncate') > -1) {
					arrTrunc.push(index);
			    }
				
				if (key.indexOf('_numeric') > -1) {
					arrNum.push(index);
			    }
				
				if (key.indexOf('_link') > -1) {
					arrLink.push(index);
			    }
				
				if (key.indexOf('_currency') > -1) {
					arrCurrency.push(index);
			    }
				
				var sHeader = key.replace(/_grouped|_truncate|_numeric|_link|_currency/gi, '');
				
				arrHeader.push({
					title: (sHeader.replace(/_/g, ' ').replace(/\b[a-z]/g, function(s){
								return s.toUpperCase();
							}))
				});
				
				index++;
			}
			
			var arrData = arrRawData.map(function(el){
				  var arr=[];
				  for(var key in el){
				    arr.push(el[key] === null ? '' : el[key]);
				  }
				  return arr;
				});
		
			return {
				header: arrHeader, 
				data: arrData,
				hide: arrHide,
				group: arrGroup,
				truncate: arrTrunc,
				numeric: arrNum,
				currency: arrCurrency,
				link: arrLink
			};
		}	
		else{
			return {header: [], data: []};
		}
		
	};
   
    return {
        getData: getData
    };
    
});
