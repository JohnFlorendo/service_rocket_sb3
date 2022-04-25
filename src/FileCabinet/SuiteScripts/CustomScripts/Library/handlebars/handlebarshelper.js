define([],

function() {
   
	register = function(option){
		
		option.registerHelper('if_even',
			    function (conditional) {

			    if ((conditional % 2) == 0) {
			        
			        return '#f1f0f0';
			    } else {
			    	return '#FFFFFF';
			    }
			});

		option.registerHelper('nohierarchy', function (value) {
		    var arrValue = value.split(':');
		    return arrValue[arrValue.length - 1];
		});

		option.registerHelper('replace', function (find, replace, options) {
		    var string = options.fn(this);
		    return string.replace(find, replace);
		});

		option.registerHelper('currency', function (value) {
		    return value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		});

		option.registerHelper('isnull', function(value) {
			
			if (value === null){
				return true;
			}
			else if (value === 'null'){
				return true;
			}
			else if (value === undefined){
				return true;
			}
			else if(value ==''){
				return true;
			}
			else{
				return false;
			}
			
		});
		
		option.registerHelper('paragraph', function (value) {
    		
    		if(value){
    			var arrValue = value.split('\r\n');
    		    return arrValue;	
    		}
    		else{
    			return[''];	
    		}
    	});
		
		return option;
	};
	
    return {
    	register: register
    };
    
});
