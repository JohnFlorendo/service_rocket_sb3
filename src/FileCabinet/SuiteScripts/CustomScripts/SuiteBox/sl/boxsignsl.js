/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */



define(['N/file', 'N/record', 'N/render', 'SuiteScripts/CustomScripts/SuitePDF/api/estimate' ,'SuiteScripts/CustomScripts/SuiteBox/api/suitebox'],
/**
 * @param {file} file
 * @param {record} record
 */
function(file, record, render, estimate, suitebox) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	
     	var paramReq = context.request.parameters;
    	var idRec = paramReq.id;
    	var sType = paramReq.type;
    	var sPdfTemplate = '';
    	
    	if(sType == 'estimate'){
    		
    		recPrint = record.load({ 
    			type: sType, 
				id: idRec, 
				isDynamic: true
			});
    		
    		var idFolder = '156527606636';
    		var sEmail = '';
    		sPdfTemplate = estimate.generate(recPrint);
    		
    	   	var pdfFile = render.xmlToPdf({
        	    xmlString: sPdfTemplate
        	});
    	   	
    	   	pdfFile.name = 'Test BoxSign.pdf';
    	   	
    	   	var stbxFolder = suitebox.updateFolder({
    			data: {
					'folder_upload_email' : {
						'access': 'open'
					},
	   				id: idFolder
    			}
    	   	});
    	   	
    	   	if(stbxFolder.status == 'SUCCESS'){
    	   		
    	   		sEmail = stbxFolder.response.data.folder_upload_email.email;
    	   		
    	   	}
    	   	else if(stbxFolder.status == 'FAILED'){
    	   		
    	   	}
    	   	
    	   	suitebox.emailUpload({
    	   		data: {
    	   			author: 'patrick.alcomendas@servicerocket.com',
    	   			email: sEmail,
    	   			subject: 'subject',
    	   			body: 'body',
    	   			attachments: [pdfFile]
    	   		}
    	   	});
    	   	
    		var stbxFolder = suitebox.updateFolder({
    			data: {
					'folder_upload_email' : null,
	   				id: idFolder
    			}
    	   	});
    		
    		var stbxSearch = suitebox.searchFile({
    			data: {
					'folder' : idFolder,
	   				'name': 'Test BoxSign.pdf'
    			}
    	   	});
    		
    		var stbxFolder = suitebox.requestSign({
    		    data: {
    		        'signers': [{
    		                'role': 'signer',
    		                'email': 'patrick.alcomendas@servicerocket.com'
    		            }
    		        ],
    		        'source_files': [{
    		                'type': 'file',
    		                'id': '123456789'
    		            }
    		        ],
    		        'parent_folder': {
    		            'type': 'folder',
    		            'id': idFolder
    		        }
    		    }
    		});

    		
    		
    	   	
    	}
    	else if(sType == 'estimatetest'){
    		
    		recPrint = record.load({	type: 'estimate', 
										id: idRec, 
										isDynamic: true});
    		sPdfTemplate = estimatetest.generate(recPrint);
    		
    		context.response.setHeader({
          		name: 'Content-disposition',
          		value: 'filename="' + recPrint.getValue({fieldId: 'tranid'}) + '_'+  recPrint.getValue({fieldId: 'custbody_atl_quote_number'}) + '.pdf"',
        	});
    		context.response.renderPdf(sPdfTemplate);
    	}
    	else if(sType == 'invoice'){
    		
    		recPrint = record.load({	type: sType, 
							id: idRec, 
							isDynamic: true});
			sPdfTemplate = invoice.generate(recPrint);
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename="' + recPrint.getValue({fieldId: 'tranid'}) + '_'+  recPrint.getText({fieldId: 'entity'}) + '.pdf"',
			});
			context.response.renderPdf(sPdfTemplate);
    	}
    	else if(sType == 'promotionletter'){
    		
			var objFile = promotionletter.generate({id: idRec});
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename='+objFile.name+'.pdf',
			});
			
			sPdfTemplate = objFile.file;
			context.response.renderPdf(sPdfTemplate);
    	}
    	else if(sType == 'promotioncycle'){
    		
    		var tskPromoCycle = task.create({
    	        taskType: task.TaskType.MAP_REDUCE,
    	        scriptId: 'customscript_cust_promocycleupload_mr',
    	        deploymentId: 'customdeploy_cust_promocycleupload_mr',
    	        params : {
    	                'custscript_promocycleid' : idRec
    	            }
    	    });
    		
    		var tskIdPromoCycle = tskPromoCycle.submit();
    		 
    		redirect.toRecord({
                type: 'customrecord_sr_promocycle',
                id: idRec
            });
    	}
    	else if(sType == 'salaryadjustmentletter'){
    		
			var objFile = letter.generateSalaryAdjustment({id: idRec});
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename='+objFile.name+'.pdf',
			});
			
			sPdfTemplate = objFile.file;
			context.response.renderPdf(sPdfTemplate); 
    	}
    	else if(sType == 'adjustmentcycle'){
    		
    		var tskAdjustmentCycle = task.create({
    	        taskType: task.TaskType.MAP_REDUCE,
    	        scriptId: 'customscript_adjustmentcycleupload_mr',
    	        deploymentId: 'customdeploy_adjustmentcycleupload_mr',
    	        params : {
    	                'custscript_addjustmentcycleid' : idRec
    	            }
    	    });
    		
    		var tskIdAdjustmentCycle = tskAdjustmentCycle.submit();
    		 
    		redirect.toRecord({
                type: 'customrecord_sr_adjustmentcycle',
                id: idRec
            });
    	}
    	else if(sType == 'termsconditions'){
    		
			var objFile = letter.generateTermsCondition({id: idRec});
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename='+objFile.name+'.pdf',
			});
			
			sPdfTemplate = objFile.file;
			context.response.renderPdf(sPdfTemplate); 
    	}
    	else if(sType == 'offerletter'){
    		
			var objFile = letter.generateOffer({id: idRec});
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename='+objFile.name+'.pdf',
			});
			
			sPdfTemplate = objFile.file;
			context.response.renderPdf(sPdfTemplate); 
    	}
    	else if(sType == 'offerletter'){
    		
			var objFile = letter.generateOffer({id: idRec});
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename='+objFile.name+'.pdf',
			});
			
			sPdfTemplate = objFile.file;
			context.response.renderPdf(sPdfTemplate); 
    	}
    	else if(sType == 'subsidiaryallowance'){
    		
			var objFile = letter.generateSubsidiaryAllowance({});
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename='+objFile.name+'.pdf',
			});
			
			sPdfTemplate = objFile.file;
			context.response.renderPdf(sPdfTemplate); 
    	}
    }

    return {
        onRequest: onRequest
    };
    
});
