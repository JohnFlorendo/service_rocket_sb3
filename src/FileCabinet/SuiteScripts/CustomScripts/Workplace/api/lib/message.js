define(['N/https'],
/**
 * @param {https} https
 */
function(https) {
	
	send = 
		
	function(option){

		
//		{
//		    "messaging_type": "RESPONSE",
//		    "recipient": {
//		        "id": "100067583743442"
//		    },
//		    "message": {
//		        "text": "hello, world!"
//		    }
//		}
		
		
		var resp = https.post({
			url : "https://graph.facebook.com/v11.0/me/messages?access_token={custsecret_workplace_dev_apikey}",
			body : JSON.stringify(option.payload),
			headers : {
				'Content-Type' : 'application/json'
			},
			credentials : [ 'custsecret_workplace_dev_apikey' ]
		});
		
		return resp;
		
	};
	
   
    return {
    	send: send
    };
    
});
