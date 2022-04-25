define(['./lib/netspot'],

function(netspot) {

	sendToHubspot = function(option){
		return netspot.sendToHubspot(option);
	}
	
    return {
    	sendToHubspot: sendToHubspot
    };
    
});
