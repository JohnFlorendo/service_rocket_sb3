define(['N/record', 'N/https', './map'],
/**
 * @param {https} https
 * @param {map} map
 */
function(record, https, map) {

	
	
	add = function(option){

        var recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: 122
        });
        
        option.mapping = JSON.parse(recMapping.getValue({
        	fieldId: 'custrecord_intmap_mapping'
        }));
		
		var objPayload = {
			rows: [{
				cells: map.row(option)
			}]
		};
	
        var response = https.post({
            url: 'https://coda.io/apis/v1/docs/Zr4PfEquPX/tables/goal/rows',
            body : JSON.stringify(objPayload),
            headers: {
            	'Content-Type' : 'application/json',
            	'Accept' : '*/*',
                'Authorization': 'Bearer {custsecret_coda_apikey}'
            },
            credentials: ["custsecret_coda_apikey"]
        });
	};
	
    return {
    	add: add
    };
    
});
