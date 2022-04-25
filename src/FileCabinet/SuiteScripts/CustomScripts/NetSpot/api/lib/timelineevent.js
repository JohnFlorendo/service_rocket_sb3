define(['N/runtime', 'N/https', 'N/record', '../../../Helper/nsmapjson'],
/**
 * @param {https} https
 * @param {record} record
 * custom modules
 * @param {nsmapjson} nsmapjson
 */
function(runtime, https, record, nsmapjson) {
	
	var CREATECBSUBS = 110;
	
	create = function(option){
		
		var rec = record.load({
		    type: option.type,
		    id: option.id,
		    isDynamic: true
		});

		var objMapping;

		if (option.type == 'customrecord_atl_marketplace_license') {

		    //Chargebee
		    if (rec.getValue({
		            fieldId: 'custrecord_lic_type'
		        }) == 2) {

		        var recMapping = record.load({
		            type: 'customrecord_integration_mapping',
		            id: CREATECBSUBS
		        });
		    }

		    objMapping = JSON.parse(recMapping.getValue({
		                fieldId: 'custrecord_intmap_mapping'
		            }));
		}

		var objPayload = nsmapjson.generate({
		    record: rec,
		    mapping: objMapping
		});
		
		var resp = https.post({
			url : "https://api.hubapi.com/crm/v3/timeline/events?hapikey={custsecret_hubspot_apikey}",
			body : JSON.stringify(objPayload),
			headers : {
				'Content-Type' : 'application/json',
				'Accept' : '*/*'
			},
			credentials : [ 'custsecret_hubspot_apikey' ]
		});
		
	};
	
	update = function(option){
		
		var rec = record.load({
		    type: option.type,
		    id: option.id,
		    isDynamic: true
		});

		var objMapping;

		if (option.type == 'customrecord_atl_marketplace_license') {

		    //Chargebee
		    if (rec.getValue({
		            fieldId: 'custrecord_lic_type'
		        }) == 2) {

		        var recMapping = record.load({
		            type: 'customrecord_integration_mapping',
		            id: CREATECBSUBS
		        });
		    }

		    objMapping = JSON.parse(recMapping.getValue({
		                fieldId: 'custrecord_intmap_mapping'
		            }));
		}

		var objPayload = nsmapjson.generate({
		    record: rec,
		    mapping: objMapping
		});
		
		var sUrl = 'https://api.hubapi.com/integrations/v1/222211/timeline/event';

        var resp = https.put({
            url: sUrl,
            body: JSON.stringify(objMapping),
            headers: {
            	'Content-Type': 'application/json', 
            	'Accept': '*/*',
                'Authorization': 'Basic ' + '{hskey}'
            },
            credentials: ['hskey']
        });
	};
	
	associate = function(option){
		
	};
	
    return {
    	create: create,
    	update: update,
    	associate: associate
    };
    
});
