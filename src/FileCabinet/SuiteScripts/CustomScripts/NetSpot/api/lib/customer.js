define(['N/record', 'N/query', 'N/https', './company' , '../../../Helper/jsonmapns'],
/**
 * @param {record} record
 * @param {search} search
 * custom modules
 * @param {jsonmapns} jsonmapns
 */
function (record, query, https, company, jsonmapns) {
   
	create = function (option) {
		
		option.action = 'create';
		
		var retMe = {
			request: option.data
		};
		
		var objCustomer = option.data;

        try {
        	
			if(!option.hasdata){
				
	        	var nsptCompany = company.get({
	        		id: option.id, 
	        		properties: ['name', 'domain', 'nsid', 'nssubsidiary', 'address', 'address2', 'city', 'state', 'country', 'zip']	
	        	});
				
	        	if(nsptCompany.status == 'FAILED'){
	        		return nsptCompany;
	        	}
	        	
	        	objCustomer = nsptCompany.response.data;
			}
		
        	var recMapping = record.load({
	            type: 'customrecord_integration_mapping',
	            id: 127
	        });
	        
	        var objCustomerMapping = JSON.parse(recMapping.getValue({
	            fieldId: 'custrecord_intmap_mapping'
	        }));
        	
			var recCustomer = record.create({
				type : record.Type.CUSTOMER,
				isDynamic : true
			});
			
			for ( var key in objCustomerMapping) {

				recCustomer = jsonmapns.jsonMap({
					mapping : objCustomerMapping,
					record : recCustomer,
					data : option.data,
					key : key
				});
			}

			var idCustomer = recCustomer.save();

			retMe.status = 'SUCCESS';
			retMe.response = {
				id: idCustomer
			};
			
	        var objPayload = {
				inputs: [{
					id: option.data.id,
					properties: {
						nsid: idCustomer
					}
		        }]
			};

	        //update NS ID back to HS 
			var resp = https.post({
				url: "https://api.hubapi.com/crm/v3/objects/companies/batch/update?hapikey={custsecret_hubspot_apikey}",
				body: JSON.stringify(objPayload),
				headers: {
					'Content-Type': 'application/json',
					'Accept': '*/*'
				},
				credentials: ['custsecret_hubspot_apikey']
			});

			return retMe;
		} 
        catch (err) {
        	
        	retMe.status = 'FAILED';
			retMe.response = {
				message: err
			};
			
			return retMe;
		}
    };
	
    return {
    	create: create
    };
    
});
