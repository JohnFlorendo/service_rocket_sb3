define(['./lib/calendar'],

function(calendar) {
	
	createCalendar = function(option){
		
		return calendar.create(option);		
	};
	
	updateCalendar = function(option){
		
		return calendar.update(option);		
	};
	
    return {
    	createCalendar: createCalendar,
    	updateCalendar: updateCalendar
    };
    
});
