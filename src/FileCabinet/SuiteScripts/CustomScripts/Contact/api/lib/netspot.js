define(['../../../NetSpot/api/netspot'],

function(netspot) {
	
	createRecord = function(option){
		return netspot.createRecord(option);
	};
	
	updateRecord = function(option){
		return netspot.updateRecord(option);
	};
	
	associateRecord = function(option){
		return netspot.associateRecord(option);
	};
	
	sendToHubspot = function(option){
		
		var newRec = option.newRecord;
		var sFrom = '';

		if (newRec.getValue({
		        fieldId: 'entityid'
		    }).indexOf('(Chargebee)') > -1) {
			
			sFrom = 'chargebee';
		}
		else {
			sFrom = 'atlassian';
		}
		
		if(option.type == option.UserEventType.CREATE){

			var retMe = createRecord({
			    'version': 3,
			    'method' : option.type,
			    'type': 'contacts',
			    'from': sFrom,
			    'record': newRec
			});

//			associateRecord({
//			    'type': contacts,
//			    'id' : retMe.id,
//			    'totype': 'companies',
//			    'toid': 1,
//			    'associationtype': 1
//			})
			
			return retMe;
    	}
		else if(option.type == option.UserEventType.EDIT){
			
			return updateRecord({
			    'version': 3,
			    'method' : option.type,
			    'type': 'contacts',
			    'from': sFrom,
			    'record': newRec
			});
    	}
	}
	
    return {
    	sendToHubspot: sendToHubspot 
    };
    
});
