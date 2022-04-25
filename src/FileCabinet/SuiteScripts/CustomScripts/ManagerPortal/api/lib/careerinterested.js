define(['N/query', 'N/file'],

function(query, file) {
   
	get = function(option) {
		var arrRawData = query.runSuiteQL({
			query: file.load({
				id: 236722 //mycareerinterested.sql
			}).getContents(),
			params: option.params
		}).asMappedResults();
		
		if(arrRawData.length > 0){
			
			var arrHeader = [];
			
			for (var key in arrRawData[0]) {
				
				arrHeader.push({
					title: (key.replace(/_/g, ' ').replace(/\b[a-z]/g, function(s){
								return s.toUpperCase();
							}))
				});
			}
			
			var arrData = arrRawData.map(function(el){
				  var arr=[];
				  for(var key in el){
				    arr.push(el[key]);
				  }
				  return arr;
				});
			
			return {header: arrHeader, data: arrData};
		}	
		else{
			return {header: [], data: []};
		}
	};
	
    return {
    	get: get
    };
    
});
