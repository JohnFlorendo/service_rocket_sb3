define(['./lib/goal'],

function(goal) {
   
	addGoal = function(option){
		return goal.add(option);
	};
	
    return {
    	addGoal: addGoal
    };
    
});
