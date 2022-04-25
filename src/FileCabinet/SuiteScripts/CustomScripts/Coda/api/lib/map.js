define([],

function() {
   
	
	row = function(option){
		
		var objData = option.data;
		var objMapping = option.mapping;
		var arrCells = [];
		
		
		
        for (var key in objMapping) {

        	arrCells.push({
        		column: key,
        		value: objData[objMapping[key]]
        	});
        }
		
        return arrCells;

	};
	
	
    return {
    	row: row
    };
    
});
