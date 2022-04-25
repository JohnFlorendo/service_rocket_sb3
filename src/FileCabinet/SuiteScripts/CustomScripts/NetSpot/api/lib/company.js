define(['N/https', 'N/record', 'N/runtime', '../../../Helper/nsmapjson', '../../../Library/momentjs/moment'],
	/**
	 * @param {https} https
	 * @param {record} record
	 * @param {runtime} runtime
	 */
	function (https, record, runtime, nsmapjson, moment) {

		getPayload = function (option) {

			var rec = option.record;
			var idMap = 118;

			if (option.action == 'update') {
				idMap = 119;
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

			try {

				var objPayload = getPayload(option);

				var resp = https.post({
					url: "https://api.hubapi.com/crm/v3/objects/companies?hapikey={custsecret_hubspot_apikey}",
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

					retMe.result = {
						status: 'SUCCESS',
						id: objBody.id,
						message: 'Hubpsot Deal Created ' + (new Date()).toString()
					};

					retMe.record.setValue({
						fieldId: 'custbody_nshs_logs',
						value: retMe.result.message
					});
					retMe.record.setValue({
						fieldId: 'custbody_hubspot_id',
						value: objBody.id
					});

					retMe.record.setValue({
						fieldId: 'custbody_hubspot_hs_lastmodifieddate',
						value: new Date(objBody.properties.hs_lastmodifieddate).getTime().toString()
					});
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

					retMe.result = {
						status: 'FAILED',
						message: resp.code + ': ' + objBody.message
					};

					retMe.record.setValue({
						fieldId: 'custbody_nshs_logs',
						value: retMe.result.status + ': ' + retMe.result.message
					});
				}
			}

			catch (err) {

				retMe.result = {
					status: 'FAILED',
					message: err
				};

				retMe.record.setValue({
					fieldId: 'custbody_nshs_logs',
					value: retMe.result.status + ': ' + retMe.result.message
				});

			}

			log.audit({
				title: 'deal create' + retMe.record.id,
				details: 'request: ' + JSON.stringify(objPayload) + ' response: ' + JSON.stringify(retMe.result)
			});

			return retMe;
		};

		update = function (option) {

			var retMe = option;
			option.action = 'update';

			try {

				//Hubspot Batch Update Payload {inputs: [{deals}]}
				var objPayload = { inputs: [getPayload(option)] };

				var resp = https.post({
					url: "https://api.hubapi.com/crm/v3/objects/companies/batch/update?hapikey={custsecret_hubspot_apikey}",
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

					retMe.result = {
						status: 'SUCCESS',
						id: objBody.id,
						message: 'Hubpsot Deal Updated ' + (new Date()).toString()
					};

					retMe.record.setValue({
						fieldId: 'custbody_nshs_logs',
						value: retMe.result.message
					});

					retMe.record.setValue({
						fieldId: 'custbody_hubspot_hs_lastmodifieddate',
						value: new Date(objBody.properties.hs_lastmodifieddate).getTime().toString()
					});
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

					retMe.result = {
						status: 'FAILED',
						message: resp.code + ': ' + objBody.message
					};

					retMe.record.setValue({
						fieldId: 'custbody_nshs_logs',
						value: retMe.result.status + ': ' + retMe.result.message
					});
				}
			}

			catch (err) {

				retMe.result = {
					status: 'FAILED',
					message: err
				};

				retMe.record.setValue({
					fieldId: 'custbody_nshs_logs',
					value: retMe.result.status + ': ' + retMe.result.message
				});

			}

			log.audit({
				title: 'deal update' + retMe.record.id,
				details: 'request: ' + JSON.stringify(objPayload) + ' response: ' + JSON.stringify(retMe.result)
			});

			return retMe;
		};

		get = function (option) {

			var retMe = option;

			try {

				var sProperties = '';
				
				if(option.properties.length > 0){
					sProperties = ((option.properties.map(function(a){
						return '&properties='+a;
					})).toString()).replace(/,/g,'');
				}
				
				
				var resp = https.get({
					url: "https://api.hubapi.com/crm/v3/objects/companies/"
						+ option.id + "?archived=false&hapikey={custsecret_hubspot_apikey}" + sProperties,
					headers: {
						'Content-Type': 'application/json',
						'Accept': '*/*'
					},
					credentials: ['custsecret_hubspot_apikey']
				});

				if (resp.code == 200 || resp.code == 201) {

					var dDate = new Date();

					var objBody = JSON.parse(resp.body);

					retMe.result = {
						status: 'SUCCESS',
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

					retMe.result = {
						status: 'FAILED',
						message: resp.code + ': ' + objBody.message
					};
				}
			}
			catch (err) {

				retMe.result = {
					status: 'FAILED',
					message: err
				};
			}

			return retMe;
		};

		search = function (option) {

			var retMe = option;
			var arrCompanies = [];

			try {

				var objPayload = {
//					"filterGroups": [{
//
//						"filters": [{
//							"propertyName": "createdate",
//							"operator": "GTE",
//							"value": (moment().subtract(1, 'days')).valueOf()
//						}],
//						"filters": [{
//							"propertyName": "hs_lastmodifieddate",
//							"operator": "GTE",
//							"value": (moment().subtract(1, 'days')).valueOf()
//						}]
//						
//					}],
					properties: [
						"name",
						"domain",
						"nsid"
					],
					sorts: [
						"createdAt"
					],
					limit: 100,
					after: 0

				};
				var sNext = 'firstrun';

				while (sNext != '' && runtime.getCurrentScript().getRemainingUsage() > 100) {

					var resp = https.post({
						url: "https://api.hubapi.com/crm/v3/objects/companies/search?hapikey={custsecret_hubspot_apikey}",
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
						arrCompanies = arrCompanies.concat(objBody.results);;

						if (objBody.paging != undefined) {
							if (objBody.paging.next.after) {
								sNext = objBody.paging.next.after;
								objPayload.after = objBody.paging.next.after;
							}
							else {
								sNext = '';
							}
						}
						else {
							sNext = '';
						}

						retMe.result = {
							status: 'SUCCESS',
							data: arrCompanies
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

						retMe.result = {
							status: 'FAILED',
							message: resp.code + ': ' + objBody.message
						};
					}
				}
			}

			catch (err) {

				retMe.result = {
					status: 'FAILED',
					message: err
				};
			}

			log.audit({
				title: 'search',
				details: 'retMe: ' + JSON.stringify(retMe)
			});

			return retMe;
		};

		return {
			create: create,
			get: get,
			update: update,
			search: search
		};

	});
