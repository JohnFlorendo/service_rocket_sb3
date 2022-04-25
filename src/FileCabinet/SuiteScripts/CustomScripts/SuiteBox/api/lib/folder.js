define(['N/https'],

function(https) {
   
	create = function(option){
		
	};
	
	update = function(option){

		var retMe = {
			request : option
		};
		
		option.data = { 
			'folder_upload_email' : {
				'access': 'open'
			} 
		};
		
		var resp = https.put({
			url: 'https://api.box.com/2.0/folders/' + option.data.id, 
			body: JSON.stringify(option.data), 
			headers: {
				'content-type': 'application/json', 
				'authorization' : "Bearer {custsecret_box_apikey}"
			},
			credentials : [ 'custsecret_box_apikey' ]
			
		});
		
		if (resp.code == 200 || resp.code == 201) {

			var objBody = JSON.parse(resp.body);

			retMe.status = 'SUCCESS';
			retMe.response = {
				data: objBody,
			};
		}
		else {

			var objBody = {};

			try {
				objBody = JSON.parse(resp.body);
			}
			catch (err) {

				var e = err;
				objBody.message = resp.body;
			}

			retMe.status = 'FAILED';
			retMe.response = {
				message: resp.code + ': ' + objBody.message
			};
		}

		return retMe;

	};
	
    return {
    	create: create,
        update: update
    };
    
});
