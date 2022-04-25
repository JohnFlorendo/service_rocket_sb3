/**
 * @NApiVersion 2.0
 * @NModuleScope SameAccount
 */

define(['N/https', 'N/encode', 'N/search', 'N/record', 'N/runtime', './entity', '../../../Helper/jsonmapns'],
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
    function (https, encode, search, record, runtime, entity, jsonmapns) {

	
    var INVOICE = 'customrecord_atl_marketplace_transaction';
    var CB_MAIN_CONTACT = 3;
    var CB_BILL_CONTACT = 4;
    var SCRIPTDEPLOY = 16004;
	
    pullInvoices = function (arrInvoices) {

        var arrInvoices = getInvoices();

    	arrInvoices.forEach(function (invoice) {
            var id = createInvoice(invoice);
        });
    };

    getInvoices = function(){
    	
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
                title: 'getInvoices',
                details: 'sParams: ' + sParams
            });
            
          
        var arrInvoices = [];
        var sNextOffset = '';
        //var sNextOffset = '["1596178800000","197910082"]';
        var sLastOffset = '';
            
        while (sNextOffset != undefined) {

            sLastOffset = sNextOffset;

            var response = https.get({
                url: sNextLink + sParams + '&offset=' + sNextOffset,
                headers: {
                    'Authorization': 'Basic ' + '{custsecret_chargebee_apikey}'
                },
                credentials: ['custsecret_chargebee_apikey']
            });

            if (response.code == 200) {

                var objBody = JSON.parse(response.body);
                arrInvoices = arrInvoices.concat(objBody.list);
                sNextOffset = objBody.next_offset;
                
                log.audit({
                    title: 'getInvoices',
                    details: 'objBody.next_offset: ' + objBody.next_offset
                });
            }
        }

        log.audit({
            title: 'getInvoices',
            details: 'sLastOffset: ' + sLastOffset
        });

        for (var index in arrInvoices) {
        	arrInvoices[index].key = arrInvoices[index].invoice.id;
        }

        log.audit({
            title: 'getInvoices',
            details: 'invoices: ' + arrInvoices.length
        });
        
        return arrInvoices;
    };
    
    createInvoice = function(data){
    	
    	var sDataRaw = JSON.stringify(data);
    	
    	var idInvoiceMap = runtime.getCurrentScript().getParameter({
            name: 'custscript_cb_invoicemap'
        });
        var idInvoiceContactMap = runtime.getCurrentScript().getParameter({
            name: 'custscriptcb_invoicecontactmap'
        });
    	
        var recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: idInvoiceMap || 6
        });
        
        var objInvoiceMapping = JSON.parse(recMapping.getValue({
                    fieldId: 'custrecord_intmap_mapping'
                }));
        
        recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: idInvoiceContactMap || 101
        });
        
        var objInvoiceContactMapping = JSON.parse(recMapping.getValue({
                    fieldId: 'custrecord_intmap_mapping'
                }));
       
        //Get NS ID
        data.invoice.customer_id = entity.seachChargebeeCustomer(jsonmapns.jsonGetValue({
            mapping: objInvoiceMapping,
            data: data,
            key: 'custrecord_customer'
        }));
        
        if(data.invoice.customer_id){
        	
            data.invoice.maincontact = entity.seachChargebeeContact({
                company: data.invoice.customer_id,
                role: CB_MAIN_CONTACT
            });
            
            if (jsonmapns.jsonGetValue({
                mapping: objInvoiceContactMapping,
                data: data,
                key: 'firstname'
            })) {

    	        data.invoice.billingcontact = entity.createContact({
    	            mapping: objInvoiceContactMapping,
    	            data: data
    	        });
    	    }
            
            if (data.invoice.billingcontact) {
    			record.attach({
    				record : {
    					type : record.Type.CONTACT,
    					id : data.invoice.billingcontact
    				},
    				to : {
    					type : record.Type.CUSTOMER,
    					id : data.invoice.customer_id
    				},
    				attributes : {
    					role : CB_BILL_CONTACT
    				}
    			});
    		}
        }
         
		recInvoice = record.create({
            type: INVOICE,
            isDynamic: true
        });

        for (var key in objInvoiceMapping) {

        	recInvoice = jsonmapns.jsonMap({
                mapping: objInvoiceMapping,
                record: recInvoice,
                data: data,
                key: key
            });
        }

        //Process Discount
        if (data.invoice.line_item_discounts) {

            if (data.invoice.line_item_discounts.length > 0) {

            	for (var nLine = 0; nLine < data.invoice.line_item_discounts.length; nLine++) {
            		
            		var idLineItem =  data.invoice.line_item_discounts[nLine].line_item_id;
            			
                	var nIdx = recInvoice.findSublistLineWithValue({
                	    sublistId: 'recmachcustrecord_mktp_transitem_trans',
                	    fieldId: 'name',
                	    value: idLineItem
                	});
                	
                	if(nIdx > -1){
                		
                		
                		recInvoice.selectLine({
                            sublistId: 'recmachcustrecord_mktp_transitem_trans',
                            line: nIdx
                        });	
                		
                		var nDiscount = data.invoice.line_item_discounts[nLine].discount_amount/100;
                		
                		var nAmount = recInvoice.getCurrentSublistValue({
                    	    sublistId: 'recmachcustrecord_mktp_transitem_trans',
                    	    fieldId: 'custrecord_mktp_transitem_amount'
                    	});	 
                		
                		var newAmount = nAmount - nDiscount;
                		
//                        log.audit({
//                            title: 'createInvoice',
//                            details: 'nDiscount: ' + nDiscount + '. nAmount: '+ nAmount + '. newAmount: '+ (nAmount - nDiscount)
//                        });
                		
                		recInvoice.setCurrentSublistValue({
                    	    sublistId: 'recmachcustrecord_mktp_transitem_trans',
                    	    fieldId: 'custrecord_mktp_transitem_discount',
                    	    value: nDiscount
                    	});	
                		
                		recInvoice.setCurrentSublistValue({
                    	    sublistId: 'recmachcustrecord_mktp_transitem_trans',
                    	    fieldId: 'custrecord_mktp_transitem_discountitem',
                    	    value: data.invoice.line_item_discounts[nLine].entity_id
                    	});	      		

                		recInvoice.setCurrentSublistValue({
                    	    sublistId: 'recmachcustrecord_mktp_transitem_trans',
                    	    fieldId: 'custrecord_mktp_transitem_amount',
                    	    value: newAmount
                    	});	 
                		
                		recInvoice.commitLine({
                            sublistId: 'recmachcustrecord_mktp_transitem_trans'
                        });
                	}
            	}
            }
        }
		
		recInvoice.setValue({
            fieldId: 'custrecord_raw_json',
            value: sDataRaw
        });
        
        var recInvoice = recInvoice.save();

    };

    updateInvoice = function(data){
    	
    	var recDeploy = record.load({
            type: record.Type.SCRIPT_DEPLOYMENT,
            id: SCRIPTDEPLOY,
            isDynamic: true
        });
    	
    	var idInvoiceMap = recDeploy.getValue({
            fieldId: 'custscript_cb_invoicemap'
        });
        var idCustomerMap = recDeploy.getValue({
        	fieldId: 'custscript_cb_customermap'
        });
        var idInvoiceContactMap = recDeploy.getValue({
        	fieldId: 'custscriptcb_invoicecontactmap'
        });
      
        var recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: idInvoiceMap || 6
        });
        
        var objInvoiceMapping = JSON.parse(recMapping.getValue({
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
            id: idInvoiceContactMap || 101
        });
        
        var objInvoiceContactMapping = JSON.parse(recMapping.getValue({
                    fieldId: 'custrecord_intmap_mapping'
                }));
        
        var recInvoice = record.load({
            type: INVOICE,
            id: data.nsid,
            isDynamic: true
        });
        
        var data = JSON.parse(recInvoice.getValue({
            fieldId: 'custrecord_raw_json'
        }));
        
        var sChargebeeId = jsonmapns.jsonGetValue({
			mapping : objCustomerMapping,
			data : data,
			key : 'custentity_chargebeeid'
		});
        
        
        data.invoice.customer_id = entity.seachChargebeeCustomer(jsonmapns.jsonGetValue({
            mapping: objInvoiceMapping,
            data: data,
            key: 'custrecord_customer'
        }));
        
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
        
      
        data.invoice.maincontact = entity.seachChargebeeContact({
            company: data.invoice.customer_id,
            role: CB_MAIN_CONTACT
        });
        
        if (jsonmapns.jsonGetValue({
            mapping: objInvoiceContactMapping,
            data: data,
            key: 'firstname'
        })) {

	        data.invoice.billingcontact = entity.createContact({
	            mapping: objInvoiceContactMapping,
	            data: data
	        });
	    }
        
        if (data.invoice.billingcontact) {
			record.attach({
				record : {
					type : record.Type.CONTACT,
					id : data.invoice.billingcontact
				},
				to : {
					type : record.Type.CUSTOMER,
					id : data.invoice.customer_id
				},
				attributes : {
					role : CB_BILL_CONTACT
				}
			});
		}
       
        for (var key in objInvoiceMapping) {

        	recInvoice = jsonmapns.jsonMap({
                mapping: objInvoiceMapping,
                record: recInvoice,
                data: data,
                key: key
            });
        }

        //Process Discount
        if (data.invoice.line_item_discounts) {

            if (data.invoice.line_item_discounts.length > 0) {

            	for (var nLine = 0; nLine < data.invoice.line_item_discounts.length; nLine++) {
            		
            		var idLineItem =  data.invoice.line_item_discounts[nLine].line_item_id;
            			
                	var nIdx = recInvoice.findSublistLineWithValue({
                	    sublistId: 'recmachcustrecord_mktp_transitem_trans',
                	    fieldId: 'name',
                	    value: idLineItem
                	});
                	
                	if(nIdx > -1){
                		
                		recInvoice.selectLine({
                            sublistId: 'recmachcustrecord_mktp_transitem_trans',
                            line: nIdx
                        });	
                		
                		recInvoice.setCurrentSublistValue({
                    	    sublistId: 'recmachcustrecord_mktp_transitem_trans',
                    	    fieldId: 'custrecord_mktp_transitem_discount',
                    	    value: data.invoice.line_item_discounts[nLine].discount_amount/1000
                    	});	
                		
                		recInvoice.setCurrentSublistValue({
                    	    sublistId: 'recmachcustrecord_mktp_transitem_trans',
                    	    fieldId: 'custrecord_mktp_transitem_discountitem',
                    	    value: data.invoice.line_item_discounts[nLine].entity_id
                    	});	      		

                		recInvoice.commitLine({
                            sublistId: 'recmachcustrecord_mktp_transitem_trans'
                        });
                	}
            	}
            }
        }
		
		recInvoice.setValue({
            fieldId: 'custrecord_raw_json',
            value: sDataRaw
        });
        
        var recInvoice = recInvoice.save();

    };
    
    
    return {
    	getInvoices: getInvoices,
    	createInvoice: createInvoice,
    	updateInvoice: updateInvoice,
        pullInvoices: pullInvoices
    };

});