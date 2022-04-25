define(['N/record', 'N/query', './deal', '../../../Helper/jsonmapns'],
/**
 * @param {record} record
 * @param {query} query
 */
function(record, query, deal, jsonmapns) {
   
	create = function(option){
		
		var idOpps = this.search(option);
		
		if(idOpps){
			
		}
		else{
			
		}
	};
	
	update = function(option){
		
		var idOpps = this.search(option);
		
		if(idOpps){
			
	        var recMapping = record.load({
	            type: 'customrecord_integration_mapping',
	            id: 123
	        });
	        
	        var objOppsMapping = JSON.parse(recMapping.getValue({
	                    fieldId: 'custrecord_intmap_mapping'
	        }));
			
			var objData;
			var response = deal.get({ 
				id: option.associatedObjectId
			});
			
			log.audit({title: 'opportunity.update', details: 'idOpps: ' + idOpps});
			
//			var rec = record.load({
//				type: record.Type.SALES_ORDER, 
//				id: 1889399 
//			});
			
			var recOpps = record.load({
				type: record.Type.OPPORTUNITY, 
				id: idOpps, 
				isDynamic : true 
			}); 
			
			if(response.result.status == 'SUCCESS'){
				
				objData = response.result.data;
				
		        for (var key in objOppsMapping) {

		        	recOpps = jsonmapns.jsonMap({
		                mapping: objOppsMapping,
		                record: recOpps,
		                data: objData,
		                key: key
		            });
		        }
		        
		        recOpps.setValue({
					fieldId: 'custbody_nshs_logs',
					value: 'NetSuite Opportunity Updated '+ (new Date()).toString()
				});
		        
		        log.audit({
		        	title: 'opportunity', 
		        	details: 'updated:' + objData.properties.hs_lastmodifieddate
		        });
		        
		        var id = recOpps.save();
			}
		}
		else{
			this.create(option);
		}
		
	};
	
	get = function(option){
		
	};
	
	search = function(option){
		
		var arrResult = query.runSuiteQL({
			query: 'SELECT id FROM transaction WHERE custbody_hubspot_id = ' + option.associatedObjectId
		}).asMappedResults();
		
		if(arrResult.length > 0){
			return arrResult[0].id;	
		}
		else{
			return null;
		}
	};
	
    return {
    	create: create,
    	update: update,
    	get: get,
    	search: search
    };
    
});
