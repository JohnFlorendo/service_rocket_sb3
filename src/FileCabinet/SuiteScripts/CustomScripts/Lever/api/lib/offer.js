define(['N/https', 'N/search', 'N/record', './opportunity', '../../../Helper/jsonmapns', '../../../Library/momentjs/moment'],
	/**
	 * @param {https} https
	 * @param {search} search
	 * @param {record} record
	 */
	function (https, search, record, opportunity, jsonmapns, moment) {

		get = function (option) {

			var retMe = option;

			var resp = https.get({
				url: 'https://api.lever.co/v1/opportunities/' + option.id + '/offers',
				headers: {
					'Authorization': 'Basic {custsecret_lever_wipapikey}',
					'Content-Type': 'application/json'
				},
				credentials: ['custsecret_lever_wipapikey']
			});

			if (resp.code == 200 || resp.code == 201) {

				var objBody = JSON.parse(resp.body).data;

				retMe.result = {
					status: 'SUCCESS',
					data: objBody
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

			return retMe;

		};

		create = function (option) {

			var objOffer = get(option);
			var retMe;

			if (objOffer.result.status == 'SUCCESS') {

				var recMapping = record.load({
					type: 'customrecord_integration_mapping',
					id: 111
				});

				var objMap = JSON.parse(recMapping.getValue({
					fieldId: 'custrecord_intmap_mapping'
				}));

				var data = objOffer.result.data;

				data.forEach(function (data) {

					var idJobReq;

					var idx = data.fields.map(function (map) {
						return map.identifier;
					}).indexOf('requisition');

					var idLeverId = data.fields[idx].value;

					var src = search.create({
						type: 'jobrequisition',
						columns: ['custrecord_jr_leverid'],
						filters: ['custrecord_jr_leverid', 'is', idLeverId]
					});

					var res = src.run().getRange({ start: 0, end: 1 });

					if (res.length > 0) {
						idJobReq = res[0].id;
					}

					data.fields[idx].value = idJobReq;

					var rec = record.create({
						type: 'customrecord_joboffer',
						isDynamic: true
					});

					rec.setValue({
						fieldId: 'custrecord_jo_lvrcandidate',
						value: option.id
					});

					for (var key in objMap) {

						rec = jsonmapns.jsonMap({
							mapping: objMap,
							record: rec,
							data: data,
							key: key
						});
					}

		            log.audit({
		                title: 'status on update',
		                details: rec.getValue('custrecord_jo_status')
		            });
					
					var idRec = rec.save();

					if (data.status == 'signed' || data.status == 'denied') {
						opportunity.removeTag({ id: option.id, tag: 'NetSuite Offered' });
						opportunity.removeTag({ id: option.id, tag: 'NetSuite Synching' });
					}
					else {
						opportunity.addTag({ id: option.id, tag: 'NetSuite Synching' });
						opportunity.removeTag({ id: option.id, tag: 'NetSuite Offered' });
					}

					retMe = {
						status: 'SUCCESS',
						message: 'Offer created.',
						id: idRec
					};
				});
			}
			else {
				retMe = objOffer.result;
			}

			return retMe;

		};

		update = function (option) {

			var objOffer = get(option);

			if (objOffer.result.status == 'SUCCESS') {

				var recMapping = record.load({
					type: 'customrecord_integration_mapping',
					id: 114
				});

				var objMap = JSON.parse(recMapping.getValue({
					fieldId: 'custrecord_intmap_mapping'
				}));

				var data = objOffer.result.data;

				data.forEach(function (data) {

					var src = search.create({
						type: 'customrecord_joboffer',
						filters: ['externalid', 'is', data.id]
					});

					var res = src.run().getRange({
						start: 0,
						end: 1
					});

					if (res.length > 0) {

						var rec = record.load({
							type: 'customrecord_joboffer',
							id: res[0].id,
							isDynamic: true
						});

						rec.setValue({
							fieldId: 'custrecord_jo_lvrcandidate',
							value: option.id
						});
						
						for (var key in objMap) {

							rec = jsonmapns.jsonMap({
								mapping: objMap,
								record: rec,
								data: data,
								key: key
							});
						}
						
			            log.audit({
			                title: 'status on update',
			                details: rec.getValue('custrecord_jo_status')
			            });

						var idRec = rec.save();

						if (data.status == 'signed' || data.status == 'denied') {
							opportunity.removeTag({ id: option.id, tag: 'NetSuite Offered' });
							opportunity.removeTag({ id: option.id, tag: 'NetSuite Synching' });
						}
						else {
							opportunity.addTag({ id: option.id, tag: 'NetSuite Synching' });
							opportunity.removeTag({ id: option.id, tag: 'NetSuite Offered' });
						}

						retMe = {
							status: 'SUCCESS',
							message: 'Offer updated.',
							id: idRec
						};
					}
					else {
						retMe = { status: 'FAILED', message: 'Offer ID does not exist.' };
					}


				});
			}
			else {
				retMe = objOffer.result;
			}

			return retMe;
		};

		return {
			create: create,
			update: update
		};

	});
