define(['N/record', 'N/https', '../../../Helper/nsmapjson'],
/**
 * @param {record} record
 * @param {https} https
 */
function(record, https, nsmapjson) {
	
	getPayload = function (option) {

		var rec = option.record;
		var idMap;
		
		if (option.action == 'create') {
			idMap = 128;
		}
		else if (option.action == 'update') {
			idMap = 116;
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
	
	create = function (option) {
		
		var retMe = option;
			option.action = 'create';
		var objPayload;
		
		if(option.usemap == false || option.usemap == undefined){
			objPayload = option.data;
		}
		else{
			objPayload = this.getPayload(option);
		}
		
		try {
			
			var resp = https.post({
				url: "https://api.hubapi.com/crm/v3/objects/contacts?hapikey={custsecret_hubspot_apikey}",
				body: JSON.stringify(objPayload),
				headers: {
					'Content-Type': 'application/json',
					'Accept': '*/*'
				},
				credentials: ['custsecret_hubspot_apikey']
			});

			if (resp.code == 200 || resp.code == 201) {

				var dDate = new Date();
				var objBody = JSON.parse(resp.body);

				retMe.status = 'SUCCESS';
				
				retMe.response = {
					id: objBody.id,
					lastupdate: new Date(objBody.properties.hs_lastmodifieddate).getTime().toString(),
					message: 'Hubpsot Contact Created ' + (new Date()).toString()
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
			retMe.result = {
				message: err
			};

		}

		return retMe;
	};
	
	update = function (option) {

		var retMe = option;
		option.action = 'update';
		var objPayload;
		
		if(option.usemap == false || option.usemap == undefined){
			objPayload = option.data
		}
		else{
			objPayload = { 
				inputs: [this.getPayload(option)] 
			};
		}
		

		try {
			
			var resp = https.post({
				url: "https://api.hubapi.com/crm/v3/objects/contacts/batch/update?hapikey={custsecret_hubspot_apikey}",
				body: JSON.stringify(objPayload),
				headers: {
					'Content-Type': 'application/json',
					'Accept': '*/*'
				},
				credentials: ['custsecret_hubspot_apikey']
			});

			if (resp.code == 200 || resp.code == 201) {

				var dDate = new Date();
				var objBody = JSON.parse(resp.body).results[0];

				retMe.status = 'SUCCESS';
				
				retMe.response = {
					id: objBody.id,
					lastupdate: new Date(objBody.properties.hs_lastmodifieddate).getTime().toString(),
					message: 'Hubpsot Contact Updated ' + (new Date()).toString()
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
			retMe.result = {
				message: err
			};

		}

		return retMe;
	};
	
    return {
    	create: create,
    	update: update,
    	getPayload: getPayload
    };
    
});
