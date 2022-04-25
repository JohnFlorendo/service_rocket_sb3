define(['N/file','N/query'],

function(file, query) {
	
	get = function(option) {
		
//		
		var arrJSON = query.runSuiteQL({
			query: file.load({
				id: '../../sql/activerocketeers.sql'
			}).getContents().replace('{{id}}', option.id),
			//params: [option.id]
		}).asMappedResults();
	
        for (var index in arrJSON) {
        	
    		if(arrJSON[index].kolbemo === null){
    			arrJSON[index].kolbemo = '';
    			arrJSON[index].kolbegauge = null;
    		}
    		else{
    			arrJSON[index].kolbegauge = (arrJSON[index].kolbemo).replace(/ +/g, '-');	
    		}
    		
        }

		return arrJSON;
	};
   
    return {
    	get: get
    };
    
});
