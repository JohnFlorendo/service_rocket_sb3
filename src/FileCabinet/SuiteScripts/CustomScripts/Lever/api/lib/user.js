define(['N/https', 'N/record'],
/**
 * @param {https} https
 * @param {record} record
 */
function(https, record) {
	
	
	search = function(option){
		
		try {
			
			retMe = option;
			var resp = https.get({
				url : "https://api.lever.co/v1/users?email=" + option.email.toLowerCase(),
				headers : {
					'Authorization' : 'Basic {custsecret_lever_apikey}',
					'Content-Type' : 'application/json'
				},
				credentials : [ 'custsecret_lever_apikey' ]
			});
			
			if (resp.code == 200 || resp.code == 201) {

				var objBody = JSON.parse(resp.body);

				retMe.result = {
					status : 'SUCCESS',
					data : objBody
				};
			}
		} 
		catch (err) {
			
			retMe.result = {
					status : 'FAILED',
					message : err
				};
		}
		
		return retMe;
	};
   
    return {
        search: search
    };
    
});
