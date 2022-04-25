define(['N/record', 'N/search', '../../../Helper/jsonmapns'],
    /**
     * @param {record} record
     * @param {search} search
     * custom modules
     * @param {jsonmapns} jsonmapns
     */
    function (record, search, jsonmapns) {

	createCustomer = function (data) {

    	var objMapping = data.mapping;
    	var objData = data.data;

        try {
        	
			var recCustomer = record.create({
				type : record.Type.CUSTOMER,
				isDynamic : true
			});

//			var idSubsidiary = jsonmapns.jsonGetValue({
//				mapping : objMapping,
//				data : objData,
//				key : 'subsidiary'
//			});
//				
//			recCustomer.selectNewLine({
//			    sublistId: 'submachine'
//			});
//			recCustomer.setCurrentSublistValue({
//			    sublistId: 'submachine',
//			    fieldId: 'subsidiary',
//			    value: idSubsidiary
//			});
//			recCustomer.commitLine({
//			    sublistId: 'submachine'
//			});
//				
//			delete objMapping['subsidiary'];
				
			for ( var key in objMapping) {

				recLicense = jsonmapns.jsonMap({
					mapping : objMapping,
					record : recCustomer,
					data : objData,
					key : key
				});
			}
		
			var idCustomer = recCustomer.save();
			
			return idCustomer;
		} 
        catch (err) {
            log.audit({
                title: 'createCustomer',
                details: 'err: id ' + err
            });
            
            return;
		}
    };

    updateCustomer = function(data){
    	
    	var objMapping = data.mapping;
    	var objData = data.data;
    	var id = data.id;
    	
		var recCustomer = record.load({
			type : record.Type.CUSTOMER,
			id: id,
			isDynamic : true
		});
		
		for ( var key in objMapping) {

			recLicense = jsonmapns.jsonMap({
				mapping : objMapping,
				record : recCustomer,
				data : objData,
				key : key
			});
		}
		
		var idCustomer = recCustomer.save();
		
		return idCustomer;
		
    	
    };

    createContact = function (data) {

    	var objMapping = data.mapping;
    	var objData = data.data;
    	
        try {

            var sEntityId = jsonmapns.jsonGetValue({
            	mapping: objMapping,
            	data : objData,
            	key : 'entityid'
            });

            var idCompany = jsonmapns.jsonGetValue({
            	mapping: objMapping,
            	data : objData,
            	key : 'company'
            });

            var src = search.create({
                type: record.Type.CONTACT,
                columns: ['internalid']
            });
            
            src.filters = [];
            src.filters.push(search.createFilter({
                    name: 'entityid',
                    operator: search.Operator.IS,
                    values: sEntityId.trim()
                }));
            src.filters.push(search.createFilter({
                    name: 'company',
                    operator: search.Operator.ANYOF,
                    values: idCompany
                }));

            var res = src.run().getRange({
                start: 0,
                end: 1
            });
            
            var idContact;
            var recContact;

            if (res.length > 0) {
                idContact = res[0].id;
            }

            if (idContact > 0) {
                recContact = record.load({
                    type: record.Type.CONTACT,
                    id: idContact,
                    isDynamic: true
                });
            } 
            else {
                recContact = record.create({
                    type: record.Type.CONTACT,
                    isDynamic: true
                });
            }

            for (var key in objMapping) {

            	recContact = jsonmapns.jsonMap({
                	mapping: objMapping,
                	record: recContact,
                	data: objData,
                	key: key
                });
            }

            idContact = recContact.save();
            
            return idContact;
        } 
        catch (err) {
        	
            log.audit({
                title: 'createContact',
                details: 'err: id '  + err
            });
            
            return;
        }
    };

    seachChargebeeCustomer = function(id){
    	
    	var idCustomer;
    	
		var src = search.create({
			type : 'customer',
			columns : [ 'internalid', 'isinactive' ]
		});
    	
		src.filters = [];
		src.filters.push(search.createFilter({
			name : 'custentity_chargebeeid',
			operator : 'is',
			values : id
		}));
		
		var res = src.run().getRange({
			start : 0,
			end : 1
		});
		
		if (res.length > 0) {
			idCustomer = res[0].id;
		}
		else{
			return false;
		}
		
		return idCustomer;
    };
    
    seachChargebeeContact = function(data){
    	
        var src = search.create({
            type: record.Type.CONTACT,
            columns: ['internalid']
        });
        
        src.filters = [];
        src.filters.push(search.createFilter({
                name: 'company',
                operator: search.Operator.ANYOF,
                values: data.company
            }));
        
        src.filters.push(search.createFilter({
            name: 'contactrole',
            operator: search.Operator.ANYOF,
            values: data.role
        }));

        var res = src.run().getRange({
            start: 0,
            end: 1
        });
        
        var idContact;
        
		if (res.length > 0) {
			idContact = res[0].id;
		}
		
		return idContact;
    };
    
    
    return {
        createCustomer: createCustomer,
        updateCustomer: updateCustomer,
        createContact: createContact,
        seachChargebeeCustomer: seachChargebeeCustomer,
        seachChargebeeContact: seachChargebeeContact
    };

});
