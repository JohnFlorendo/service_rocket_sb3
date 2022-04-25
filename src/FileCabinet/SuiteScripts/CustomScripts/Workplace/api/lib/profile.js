define(['N/record', 'N/https', '../../../Helper/nsmapjson'],

function(record, https, nsmapjson) {
	
	getPayload = function (option) {

		var rec = option.record;
		var idMap = 126;

		if (option.action == 'update') {
			idMap = 126;
		}

		var recMapping = record.load({
			type: 'customrecord_integration_mapping',
			id: idMap
		});

		var objMap = JSON.parse(recMapping.getValue({
			fieldId: 'custrecord_intmap_mapping'
		}));

		var objPayload = nsmapjson.generate({
			mapping: objMap,
			record: rec
		});

		return objPayload;
	};
	
	
	update = function(option){
		
		var retMe = {
			status: '',
			request: option 
		};
		
		option.action = 'update';

		try {

			var objPayload = getPayload(option);

			log.audit({
				title: 'profile.update' , 
				details: 'payload: ' + JSON.stringify(objPayload)
			});
			
			var resp = https.post({
				url: "https://graph.facebook.com/v6.0/" + option.id,
				body: JSON.stringify(objPayload),
				headers: {
					'Content-Type': 'application/json',
					 'Authorization': 'Bearer {custsecret_workplace_apikey}',
					'Accept': '*/*'
				},
				credentials: ['custsecret_workplace_apikey']
			});

			if (resp.code == 200 || resp.code == 201) {

				var dDate = new Date();

				var objBody = JSON.parse(resp.body);

				retMe.status = 'SUCCESS';
				
				retMe.response = {
					message: 'Workplace Profile Updated ' + (new Date()).toString()
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
		}

		catch (err) {

			retMe.status = 'FAILED';
			
			retMe.response = {
				message: err
			};
		}

		return retMe;
	};
	
    return {
        update:update
    };
    
});
