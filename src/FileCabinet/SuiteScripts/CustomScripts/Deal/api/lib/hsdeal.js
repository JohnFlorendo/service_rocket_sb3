define(['N/record', 'N/query', '../../../Helper/jsonmapns' ],
/**
 * @param {record} record
 */
function(record, query, jsonmapns) {
	
	create = function(option){
		
        var recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: 120
        });
        
        var objDealMapping = JSON.parse(recMapping.getValue({
            fieldId: 'custrecord_intmap_mapping'
        }));
        
        var recDeal;
        
        var arrHsDeal = query.runSuiteQL('SELECT id FROM customrecord_hsdeal WHERE externalid = ' + option.id).asMappedResults();
        
        if(arrHsDeal.length > 0){

        	recDeal = record.load({
                type: 'customrecord_hsdeal',
                id: arrHsDeal[0].id,
                isDynamic: true
            });
        }
        else{
        	
        	recDeal = record.create({
                type: 'customrecord_hsdeal',
                isDynamic: true
            });
        }

		
        for (var key in objDealMapping) {

        	recDeal = jsonmapns.jsonMap({
                mapping: objDealMapping,
                record: recDeal,
                data: option,
                key: key
            });
        }
        
        return recDeal.save();

	};
	
    return {
    	create: create
    };
    
});
