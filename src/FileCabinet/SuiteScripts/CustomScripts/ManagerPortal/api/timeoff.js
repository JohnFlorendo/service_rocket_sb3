define(['N/query', './lib/employee', './lib/timeoffbalance', './lib/mytimeoffbalance'],

function(query, employee, timeoffbalance, mytimeoffbalance) {
	
	getMyTimeOffBalance = function(option){
		return timeoffbalance.getMine(option);	
	};
		
	getMyTimeOffBalances = function(option){
		return timeoffbalance.getBalances(option);	
	};
	
	getMyTeamBalance = function(option){
		
		log.audit({ title: 'getMyTeamBalance', details: 'typeOf ' + option+  ': ' + typeof option });
		
		return timeoffbalance.getMyTeam(option);
	};
	
	getAllBallance = function(option){
		
		log.audit({ title: 'getAllBallance', details: 'typeOf ' + option+  ': ' + typeof option });
		
		var orgChart = employee.getFamily();
		var idsAll = employee.getAllTeam({list: orgChart, key: 'id', value: option});
		
		return timeoffbalance.getAll({id: idsAll});
	};
	


    return {
    	getMyTimeOffBalance: getMyTimeOffBalance,
    	getMyTimeOffBalances: getMyTimeOffBalances,
    	getMyTeamBalance : getMyTeamBalance,
    	getAllBallance : getAllBallance
    };
    
});
