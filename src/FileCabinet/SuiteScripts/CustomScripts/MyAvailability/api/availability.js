define(['N/file', 'N/query', './lib/myavailability'],
/**
 * @param {file} file
 */
function(file, query, myavailability) {
   
	getMyAvailability = function(option){
		return myavailability.get(option);
	};
	
    return {
    	getMyAvailability: getMyAvailability
    };
    
});
