define(['N/record', '../../../Helper/nstojson', '../../../Helper/jsonmapns', '../../../Library/momentjs/moment'],
/**
 * @param {record} record
 * @param {nstojson} nstojson
 * @param {jsonmapns} jsonmapns
*/
function(record, nstojson, jsonmapns, moment) {
	
	onboard = function(option){
		
		//Load Job Req
		//Load Job Offer
		//Upload
		
		var recOffer = record.load({
			type: 'customrecord_joboffer',
			id: option.id,
			isDynamic: true
		});

		var recRequisition = record.load({
			type: 'jobrequisition',
			id: recOffer.getValue({
				fieldId: 'custrecord_jo_jobrequisition'
			}),
			isDynamic: true,
			defaultValues: Object
		});
		
		var objOffer = nstojson.get(recOffer);
		var objRequisition = nstojson.get(recRequisition);

        for (var key in objOffer) {
            objRequisition[key] = objOffer[key];
        }

		var recMapping = record.load({
			type: 'customrecord_integration_mapping',
			id: 117
		});

		var objMap = JSON.parse(recMapping.getValue({
			fieldId: 'custrecord_intmap_mapping'
		}));
		
		var rec = record.create({ type: record.Type.EMPLOYEE , isDynamic : true});
		
		for (var key in objMap) {

			rec = jsonmapns.jsonMap({
				mapping: objMap,
				record: rec,
				data: objRequisition,
				key: key
			});
		}
		
		var mntHireDate = moment(rec.getValue('hiredate'));
		
		rec.setText({
			fieldId: 'nextreviewdate',
			text: mntHireDate.add(1, 'year').format('YYYY-MM-DD')
		});
		
//		rec.selectNewLine({
//            sublistId: 'roles'
//        });
//		
//		rec.setCurrentSublistValue({
//			sublistId : 'roles',
//			fieldId : 'selectedrole',
//			value : 1022
//		});
//        
//        rec.commitLine({
//            sublistId: 'roles'
//        });
		
		var id = rec.save();
		
		recOffer.setValue({fieldId: 'custrecord_sr_off_employee', value: id});
		var id = recOffer.save();
		
		var v =1;
	};
   
    return {
    	onboard: onboard
    };
    
});
