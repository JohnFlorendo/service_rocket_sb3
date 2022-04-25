define(['N/record', 'N/query', 'N/https', '../../../Library/momentjs/moment'],
/**
 * @param {record} record
 * @param {query} query
 * @param {https} https
 */
function(record, query, https, moment) {
   
	create = function(option){
		
		//create
		
		option.action = 'create';
		option.data.properties.hs_timestamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
		
		var retMe = {
			request: option
		};
		
		var resp = https.post({
			url: "https://api.hubapi.com/crm/v3/objects/notes?hapikey={custsecret_hubspot_apikey}",
			body: JSON.stringify(option.data),
			headers: {
				'Content-Type': 'application/json',
				'Accept': '*/*'
			},
			credentials: ['custsecret_hubspot_apikey']
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
	
	associate = function(option) {
		
		//note_to_deal
		option.action = 'create';
		var retMe = {
			request: option
		};
	
		var resp = https.put({
			url: 'https://api.hubapi.com/crm/v3/objects/notes/'+ option.data.id +'/associations/'+ option.data.to+ '/' + option.data.toid+ '/'  + option.data.type+'?hapikey={custsecret_hubspot_apikey}',
			headers: {
				'Content-Type': 'application/json',
				'Accept': '*/*'
			},
			credentials: ['custsecret_hubspot_apikey']
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
    	associate: associate
    };
    
});
