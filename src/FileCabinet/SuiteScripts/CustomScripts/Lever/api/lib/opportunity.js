define(['N/https', 'N/search', 'N/record'],
/**
 * @param {https} https
 * @param {search} search
 * @param {record} record
 */
function(https, search) {
   
	get = function(option){
		
		var retMe = option;
		
		var resp = https.get({
			url : 'https://api.lever.co/v1/opportunities' + option.parameter,
			headers : {
				'Authorization' : 'Basic {custsecret_lever_wipapikey}', 
				'Content-Type' : 'application/json'
			},
			credentials : [ 'custsecret_lever_wipapikey' ]
		});
		
		
		if (resp.code == 200 || resp.code == 201) {
			
			var objBody = JSON.parse(resp.body).data;
			
			objBody = objBody.map(function(map) {return {id: map.id};});

			retMe.result = {
					status : 'SUCCESS',
					data : objBody
				};
		} 
		else{
			
			var objBody = {};
			
			try {
				objBody = JSON.parse(resp.body);
			}
			catch (err) {
				
				var e = err;
				objBody.message = resp.body;
			}
			
			retMe.result = {
				status : 'FAILED',
				message : resp.code + ': ' + objBody.message
			};
		}
		
		return retMe;
		
	};
	
	addTag = function(option) {
		
		var retMe = option;
		
		var resp = https.post({
			url : 'https://api.lever.co/v1/opportunities/' + option.id + '/addTags',
			body: JSON.stringify({tags : [option.tag]}),
			headers : {
				'Authorization' : 'Basic {custsecret_lever_wipapikey}', 
				'Content-Type' : 'application/json'
			},
			credentials : [ 'custsecret_lever_wipapikey' ]
		});
		
		
		if (resp.code == 200 || resp.code == 201) {
			
			var objBody = JSON.parse(resp.body).data;

			retMe.result = {
					status : 'SUCCESS',
					data : objBody
				};
		} 
		else{
			
			var objBody = {};
			
			try {
				objBody = JSON.parse(resp.body);
			}
			catch (err) {
				
				var e = err;
				objBody.message = resp.body;
			}
			
			retMe.result = {
				status : 'FAILED',
				message : resp.code + ': ' + objBody.message
			};
		}
		
		return retMe;
	};
	
	removeTag = function(option) {
		
		var retMe = option;
		
		var resp = https.post({
			url : 'https://api.lever.co/v1/opportunities/' + option.id + '/removeTags',
			body: JSON.stringify({tags : [option.tag]}),
			headers : {
				'Authorization' : 'Basic {custsecret_lever_wipapikey}', 
				'Content-Type' : 'application/json'
			},
			credentials : [ 'custsecret_lever_wipapikey' ]
		});
		
		
		if (resp.code == 200 || resp.code == 201) {
			
			var objBody = JSON.parse(resp.body).data;

			retMe.result = {
					status : 'SUCCESS',
					data : objBody
				};
		} 
		else{
			
			var objBody = {};
			
			try {
				objBody = JSON.parse(resp.body);
			}
			catch (err) {
				
				var e = err;
				objBody.message = resp.body;
			}
			
			retMe.result = {
				status : 'FAILED',
				message : resp.code + ': ' + objBody.message
			};
		}
		
		return retMe;
	};
	
    return {
    	get: get,
    	addTag: addTag,
    	removeTag: removeTag
    	
    };
    
});
