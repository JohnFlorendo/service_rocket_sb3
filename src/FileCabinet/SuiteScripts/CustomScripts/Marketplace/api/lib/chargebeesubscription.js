/**
 * @NApiVersion 2.0
 * @NModuleScope SameAccount
 */

define(['N/https', 'N/encode', 'N/search', 'N/record', 'N/runtime', './entity', '../../../Helper/jsonmapns', '../../../NetSpot/api/netspot'],
    /**
     * @param {https} https
     * @param {encode} encode
     * @param {search} search
     * @param {record} record
     * @param {runtime} runtime
     * custom modules
     * @param {entity} entity
     * @param {jsonmapns} jsonmapns
     */
    function (https, encode, search, record, runtime, entity, jsonmapns, netspot) {

    var LICENSE = 'customrecord_atl_marketplace_license';
    var CB_MAIN_CONTACT = 3;
    var CB_BILL_CONTACT = 4;
    var SCRIPTDEPLOY = 15987;

    pullLicenses = function (arrLicenses) {

    	var arrLicenses = getLicenses();

        arrLicenses.forEach(function (license) {
            var id = createLicense(license);
        });
    };

    getLicenses = function () {

    	var dNSTime = new Date();
    	var dCBTime = new Date(dNSTime.getFullYear() + '/' + (parseInt(dNSTime.getMonth()) + 1) + '/' + dNSTime.getDate() + ' GMT-0000');
    	var epStart = (dCBTime.valueOf()/1000);
    	var epEnd = epStart + 86400;
        var sNextLink = runtime.getCurrentScript().getParameter({
            name: 'custscript_cb_endpoint'
        });
        var sParams = runtime.getCurrentScript().getParameter({
            name: 'custscript_cb_parameter'
        });
        	sParams = sParams.replace('{value}', '[' + epStart + ',' + epEnd + ']'  );
        	
            log.audit({
                title: 'getLicenses',
                details: 'sParams: ' + sParams
            });
        
        var arrLicenses = [];
        var sNextOffset = '';
        var sLastOffset = '';
        
        while (sNextOffset != undefined) {

            sLastOffset = sNextOffset;

            var response = https.get({
                url: sNextLink + sParams + '&offset=' + sNextOffset,
                headers: {
                    'Authorization': 'Basic {custsecret_chargebee_apikey}'
                },
                credentials: ["custsecret_chargebee_apikey"]
            });
            
            log.audit({
                title: 'getLicenses',
                details: 'response.code: ' + response.code
            });
            
            if (response.code == 200) {

                var objBody = JSON.parse(response.body);
                arrLicenses = arrLicenses.concat(objBody.list);
                
                sNextOffset = objBody.next_offset;
                //sNextOffset = undefined;
            }
            else{
            	sNextOffset = undefined;
            }
        }

        log.audit({
            title: 'getLicenses',
            details: 'sLastOffset: ' + sLastOffset
        });

        for (var index in arrLicenses) {
            arrLicenses[index].key = arrLicenses[index].subscription.id;
        }

        log.audit({
            title: 'getLicenses',
            details: 'licenses: ' + arrLicenses.length
        });
        
        return arrLicenses;
    };

    createLicense = function (data) {
    	
    	var sRaw = JSON.stringify(data);
    	
        log.audit({
            title: 'createLicense',
            details: 'objJSON 1: ' + sRaw
        });
    	
    	var idLicenseMap = runtime.getCurrentScript().getParameter({
            name: 'custscript_cb_subscriptionmap'
        });
        var idCustomerMap = runtime.getCurrentScript().getParameter({
            name: 'custscript_cb_customermap'
        });
        var idMainContactMap = runtime.getCurrentScript().getParameter({
            name: 'custscript_cb_maincontactmap'
        });
        var idBillContactMap = runtime.getCurrentScript().getParameter({
            name: 'custscript_cb_billcontactmap'
        });
  	
        var recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: idLicenseMap
        });
        
        var objLicenseMapping = JSON.parse(recMapping.getValue({
                    fieldId: 'custrecord_intmap_mapping'
                }));
        
        recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: idCustomerMap
        });
        var objCustomerMapping = JSON.parse(recMapping.getValue({
                    fieldId: 'custrecord_intmap_mapping'
                }));
        
        recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: idMainContactMap
        });
        var objMainContactMapping = JSON.parse(recMapping.getValue({
                    fieldId: 'custrecord_intmap_mapping'
                }));
        recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: idBillContactMap
        });
        
        var objBillingContactMapping = JSON.parse(recMapping.getValue({
                    fieldId: 'custrecord_intmap_mapping'
                }));
       
        var src = search.create({
            type: LICENSE,
            columns: ['internalid'],
            filters: ['externalid', 'anyof', jsonmapns.jsonGetValue({
                    mapping: objLicenseMapping,
                    data: data,
                    key: 'externalid'
                })]
        });

        var res = src.run().getRange({
            start: 0,
            end: 1
        });

        var recLicense;

        if (res.length > 0) {
            recLicense = record.load({
                type: LICENSE,
                id: res[0].id,
                isDynamic: true
            });
        } else {
            recLicense = record.create({
                type: LICENSE,
                isDynamic: true
            });
        }
        
//      License Type;
        
        if(data.subscription.started_at == data.subscription.activated_at){
        	data.subscription.licensetype = 'New';
        }
        else if(data.subscription.started_at < data.subscription.activated_at){
        	data.subscription.licensetype = 'Renew';
        }
        

        for (var key in objLicenseMapping) {

            recLicense = jsonmapns.jsonMap({
                mapping: objLicenseMapping,
                record: recLicense,
                data: data,
                key: key
            });
        }
        
        log.audit({
            title: 'createLicense',
            details: 'objJSON 2: ' + sRaw
        });
        
        recLicense.setValue({
            fieldId: 'custrecord_lic_raw_json',
            value: sRaw
        });
        
        log.audit({
            title: 'createLicense',
            details: 'recLicense: ' + recLicense.getValue({
                fieldId: 'custrecord_lic_raw_json'
            })
        });
        
        data.licensensid = recLicense.save();

//		Process Customer
        
        if(data.customer.company == undefined){
        	data.customer.company = data.customer.id;
        	objCustomerMapping.entityid = data.customer.id;
        }
        
        var sCompanyName = jsonmapns.jsonGetValue({
			mapping : objCustomerMapping,
			data : data,
			key : 'companyname'
		});
        
        var sCompanyId = jsonmapns.jsonGetValue({
			mapping : objCustomerMapping,
			data : data,
			key : 'entityid'
		});
        
        var sChargebeeId = jsonmapns.jsonGetValue({
			mapping : objCustomerMapping,
			data : data,
			key : 'custentity_chargebeeid'
		});
        
		if (sCompanyName == '' || sCompanyName == undefined) {
			sCompanyName = (data.customer.first_name + ' ' + (data.customer.last_name || ''))
					.trim();
		}
		
        if(data.customer.company == undefined){
        	data.customer.company = data.customer.id;
        	objCustomerMapping.entityid = data.customer.id;
        }
       
        data.customer.nsid = entity.seachChargebeeCustomer(sChargebeeId);
        
        if(!data.customer.nsid){
        	
        	if (sCompanyName.length > 83) {
        		
        		data.customer.comments = 'Full Company Name: ' + sCompanyName;
        		data.customer.company = sCompanyName.substring(0, 83);
			} 
       	
        	data.customer.nsid = entity.createCustomer({
                mapping: objCustomerMapping,
                data: data
            });
        }

        data.customer.billingcontact = '';

        if (jsonmapns.jsonGetValue({
                mapping: objBillingContactMapping,
                data: data,
                key: 'firstname'
            })) {

            data.customer.billingcontact = entity.createContact({
                mapping: objBillingContactMapping,
                data: data
            });
     
        }
        
        data.customer.maincontact = '';

        if (jsonmapns.jsonGetValue({
                mapping: objMainContactMapping,
                data: data,
                key: 'firstname'
            })) {

            data.customer.maincontact = entity.createContact({
                mapping: objMainContactMapping,
                data: data
            });
            
        }

        if(data.customer.maincontact != '' && data.customer.maincontact){
        	
            if(data.customer.maincontact == data.customer.billingcontact){
            	
                record.attach({
                    record: {
                        type: record.Type.CONTACT,
                        id: data.customer.maincontact
                    },
                    to: {
                        type: record.Type.CUSTOMER,
                        id: data.customer.nsid
                    },
                    attributes: {
                        role: CB_MAIN_CONTACT
                    }
                });
            }
            else if(data.customer.maincontact != data.customer.billingcontact){
            	
                record.attach({
                    record: {
                        type: record.Type.CONTACT,
                        id: data.customer.maincontact
                    },
                    to: {
                        type: record.Type.CUSTOMER,
                        id: data.customer.nsid
                    },
                    attributes: {
                        role: CB_MAIN_CONTACT
                    }
                });
            	
            	if(data.customer.billingcontact != '' && data.customer.billingcontact){
                	
                    record.attach({
                        record: {
                            type: record.Type.CONTACT,
                            id: data.customer.billingcontact
                        },
                        to: {
                            type: record.Type.CUSTOMER,
                            id: data.customer.nsid
                        },
                        attributes: {
                            role: CB_BILL_CONTACT
                        }
                    });
                }
            }
        }
        else{
      	
        	if(data.customer.billingcontact){
        		
        		record.attach({
                    record: {
                        type: record.Type.CONTACT,
                        id: data.customer.billingcontact
                    },
                    to: {
                        type: record.Type.CUSTOMER,
                        id: data.customer.nsid
                    },
                    attributes: {
                        role: CB_BILL_CONTACT
                    }
                });
        	}
        }

        var recLicense = record.load({
            type: LICENSE,
            id: data.licensensid
        });

        recLicense.setValue({
            fieldId: 'custrecord_lic_company',
            value: data.customer.nsid
        });

        recLicense.setValue({
            fieldId: 'custrecord_lic_tech_contact',
            value: data.customer.maincontact
        });

        recLicense.setValue({
            fieldId: 'custrecord_lic_billing_contact',
            value: data.customer.billingcontact
        });
        
        var idLicense = recLicense.save();
        
        
        //HS Association
        
        
        
        
    };
    
    updateLicense = function (option){
    	
    	var recDeploy = record.load({
            type: record.Type.SCRIPT_DEPLOYMENT,
            id: SCRIPTDEPLOY,
            isDynamic: true
        });
    	
    	var idLicenseMap = recDeploy.getValue({
            fieldId: 'custscript_cb_subscriptionmap'
        });
        var idCustomerMap = recDeploy.getValue({
        	fieldId: 'custscript_cb_customermap'
        });
        var idMainContactMap = recDeploy.getValue({
        	fieldId: 'custscript_cb_maincontactmap'
        });
        var idBillContactMap = recDeploy.getValue({
        	fieldId: 'custscript_cb_billcontactmap'
        });
  	
        var recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: idLicenseMap
        });
        
        var objLicenseMapping = JSON.parse(recMapping.getValue({
                    fieldId: 'custrecord_intmap_mapping'
                }));
        
        recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: idCustomerMap
        });
        
        var objCustomerMapping = JSON.parse(recMapping.getValue({
                    fieldId: 'custrecord_intmap_mapping'
                }));
        
        recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: idMainContactMap
        });
        var objMainContactMapping = JSON.parse(recMapping.getValue({
                    fieldId: 'custrecord_intmap_mapping'
                }));
        recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: idBillContactMap
        });
        
        var objBillingContactMapping = JSON.parse(recMapping.getValue({
                    fieldId: 'custrecord_intmap_mapping'
                }));
    	
        var recLicense = record.load({
            type: LICENSE,
            id: option.id,
            isDynamic: true
        });
        
        var data = JSON.parse(recLicense.getValue({
            fieldId: 'custrecord_lic_raw_json'
        }));
        
//      License Type;
        
        if(data.subscription.started_at == data.subscription.activated_at){
        	data.subscription.licensetype = 'New';
        }
        else if(data.subscription.started_at < data.subscription.activated_at){
        	data.subscription.licensetype = 'Renew';
        }
        
        recLicense.setValue({
            fieldId: 'custrecord_lic_raw_json',
            value: JSON.stringify(data)
        });

        for (var key in objLicenseMapping) {

            recLicense = jsonmapns.jsonMap({
                mapping: objLicenseMapping,
                record: recLicense,
                data: data,
                key: key
            });
        }
        
        data.licensensid = recLicense.save();
        
//		Process Customer
        
        if(data.customer.company == undefined){
        	data.customer.company = data.customer.id;
        	objCustomerMapping.entityid = data.customer.id;
        }
        
        var sCompanyName = jsonmapns.jsonGetValue({
			mapping : objCustomerMapping,
			data : data,
			key : 'companyname'
		});
        
        var sCompanyId = jsonmapns.jsonGetValue({
			mapping : objCustomerMapping,
			data : data,
			key : 'entityid'
		});
        
        var sChargebeeId = jsonmapns.jsonGetValue({
			mapping : objCustomerMapping,
			data : data,
			key : 'custentity_chargebeeid'
		});
        
		if (sCompanyName == '' || sCompanyName == undefined) {
			sCompanyName = (data.customer.first_name + ' ' + (data.customer.last_name || ''))
					.trim();
		}
      
        data.customer.nsid = entity.seachChargebeeCustomer(sChargebeeId);
        
        if(!data.customer.nsid){
        	
        	if (sCompanyName.length > 83) {
        		
        		data.customer.comments = 'Full Company Name: ' + sCompanyName;
        		data.customer.company = sCompanyName.substring(0, 83);
			} 
       	
        	data.customer.nsid = entity.createCustomer({
                mapping: objCustomerMapping,
                data: data
            });
        }

        data.customer.billingcontact = '';

        if (jsonmapns.jsonGetValue({
                mapping: objBillingContactMapping,
                data: data,
                key: 'firstname'
            })) {

            data.customer.billingcontact = entity.createContact({
                mapping: objBillingContactMapping,
                data: data
            });
     
        }
        
        data.customer.maincontact = '';

        if (jsonmapns.jsonGetValue({
                mapping: objMainContactMapping,
                data: data,
                key: 'firstname'
            })) {

            data.customer.maincontact = entity.createContact({
                mapping: objMainContactMapping,
                data: data
            });
            
        }

        if(data.customer.maincontact != '' && data.customer.maincontact){
        	
            if(data.customer.maincontact == data.customer.billingcontact){
            	
                record.attach({
                    record: {
                        type: record.Type.CONTACT,
                        id: data.customer.maincontact
                    },
                    to: {
                        type: record.Type.CUSTOMER,
                        id: data.customer.nsid
                    },
                    attributes: {
                        role: CB_MAIN_CONTACT
                    }
                });
            }
            else if(data.customer.maincontact != data.customer.billingcontact){
            	
                record.attach({
                    record: {
                        type: record.Type.CONTACT,
                        id: data.customer.maincontact
                    },
                    to: {
                        type: record.Type.CUSTOMER,
                        id: data.customer.nsid
                    },
                    attributes: {
                        role: CB_MAIN_CONTACT
                    }
                });
            	
            	if(data.customer.billingcontact != '' && data.customer.billingcontact){
                	
                    record.attach({
                        record: {
                            type: record.Type.CONTACT,
                            id: data.customer.billingcontact
                        },
                        to: {
                            type: record.Type.CUSTOMER,
                            id: data.customer.nsid
                        },
                        attributes: {
                            role: CB_BILL_CONTACT
                        }
                    });
                }
            }
        }
        else{
      	
        	if(data.customer.billingcontact){
        		
        		record.attach({
                    record: {
                        type: record.Type.CONTACT,
                        id: data.customer.billingcontact
                    },
                    to: {
                        type: record.Type.CUSTOMER,
                        id: data.customer.nsid
                    },
                    attributes: {
                        role: CB_BILL_CONTACT
                    }
                });
        	}
        }

        var recLicense = record.load({
            type: LICENSE,
            id: data.licensensid
        });

        recLicense.setValue({
            fieldId: 'custrecord_lic_company',
            value: data.customer.nsid
        });

        recLicense.setValue({
            fieldId: 'custrecord_lic_tech_contact',
            value: data.customer.maincontact
        });

        recLicense.setValue({
            fieldId: 'custrecord_lic_billing_contact',
            value: data.customer.billingcontact
        });
        
       return recLicense;
        
    };

    return {
        getLicenses: getLicenses,
        createLicense: createLicense,
        pullLicenses: pullLicenses,
        updateLicense: updateLicense
    };

});