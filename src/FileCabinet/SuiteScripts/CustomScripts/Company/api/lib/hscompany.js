define(['N/record', '../../../Helper/jsonmapns' ],
/**
 * @param {record} record
 */
function(record, jsonmapns) {
   
	create = function(option){
		
        var recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: 121
        });
        
        var objCompanyMapping = JSON.parse(recMapping.getValue({
            fieldId: 'custrecord_intmap_mapping'
        }));
		
		var recCompany = record.create({
            type: 'customrecord_hscompany',
            isDynamic: true
        });

		
		
        for (var key in objCompanyMapping) {

        	recCompany = jsonmapns.jsonMap({
                mapping: objCompanyMapping,
                record: recCompany,
                data: option,
                key: key
            });
        }
        
        return recCompany.save();

	};
	
    return {
    	create: create
    };
    
});
