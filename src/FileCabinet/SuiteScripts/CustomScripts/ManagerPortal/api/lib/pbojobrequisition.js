define(['N/query', 'N/file', './pbojobrequisitionstickies'],

function(query, file, pbojobrequisitionstickies) {
   
	get = function(option){
		
		var arrHeader = [];
		
		var arrRawData = query.runSuiteQL({
			query: file.load({
				id: 233998 //pbojobrequisition.sql
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
		
		var arrStickies = pbojobrequisitionstickies.get({id: option.id});
		
		if(arrStickies.data != undefined ){
			
			if (arrStickies.data.length > 0) {
				
				arrStickies = arrStickies.data;
				arrData.forEach(function(data, idx, arrdata) {

					var objStickies = arrStickies.filter(function(stickies) {
						return stickies[0] == data[1];
					});

					arrdata[idx][15]=JSON.stringify(objStickies);

				});
			}
		}
		else{
			
		}
		
		arrHeader[16] = 'Sales Order/Estimate';

		
		
		return {header: arrHeader, data: arrData};
	};
	
    return {
    	get: get 
    };
    
});
