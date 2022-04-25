define(['N/query', 'N/file'],

function(query, file) {
   
	get = function(option){
		
		var arrHeader = [];
		
		var arrRawData = query.runSuiteQL({
			query: file.load({
				id: 234098 //pbojobrequisitionstickies.sql
			}).getContents(),
			params: option.id
		}).asMappedResults();	
		
		if(arrRawData.length > 0){
			
			for (var key in arrRawData[0]) {
				
				arrHeader.push((key.replace(/_/g, ' ').replace(/\b[a-z]/g, function(s){
								return s.toUpperCase();
							})));
			}
			
			var arrData = arrRawData.map(function(el){
				  var arr=[];
				  for(var key in el){
				    arr.push(el[key]);
				  }
				  return arr;
				});
		}
		
		return {header: arrHeader, data: arrData};
	};
	
    return {
    	get: get 
    };
    
});
