define(['N/file','N/query'],

function(file, query) {
	
	get = function(option) {
		
		return query.runSuiteQL({
							query: file.load({
								id: '../../sql/terminatedrocketeers.sql'
							}).getContents().replace('{{id}}', option.id),
							//params: [option.id]
						}).asMappedResults();
	};
   
    return {
    	get: get
    };
    
});
