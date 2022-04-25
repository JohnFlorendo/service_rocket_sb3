define(['N/file', 'N/record', 'N/render', 'N/runtime', 'N/email', '../../SuiteBox/api/suitebox'],
/**
 * @param {file} file
 * @param {record} record
 * Originally Deployed on 24 Feb 2021
 */
function(file, record, render, runtime, email, suitebox) {
	
	uploadExpenseReport = function(newRec){
		
		//***24 Feb 2021 ITSM-1582
		
		try{
			var sRecType = newRec.type;
			var sPrefix = newRec.getText({fieldId: 'entity'}).replace(/ /g, '') + '_' + newRec.getValue({fieldId: 'tranid'}) + '_' + newRec.getText({fieldId: 'trandate'});
			var objErPdf = render.transaction({
			    		entityId: newRec.id,
			    		printMode: render.PrintMode.PDF});
			
			objErPdf.name = sPrefix  + '.pdf';
			
			var arrAttachment = [objErPdf];
			
			for (var nLine = 0; nLine < newRec.getLineCount({sublistId: 'expense'}); nLine++) {

				var idFile = newRec.getSublistValue({sublistId: 'expense', fieldId: 'expmediaitem', line: nLine});
				var objFile = file.load({id: idFile});
				
				//***updated 25 Feb 2021
				
				if(objFile.size < 10000000){
					objFile.name = sPrefix + '_' + objFile.name;
					arrAttachment.push(objFile);
				}
				else{
					
					email.send({
					    author: runtime.getCurrentUser().id,
					    recipients: 'accounts@servicerocket.com',
					    subject: 'Expense Report Box Upload: File Size Exceeds',
					    body: 'A File named ' + objFile.name + ' on Expense Report #' + newRec.getValue({fieldId: 'tranid'}) +
					    	' exceeds the 10MB limit. Please upload it manually.',
					    relatedRecords: { transactionId: newRec.id}
					});
				}
				//***
				
			}
			
			var objEmail = {};
			objEmail.author = runtime.getCurrentUser().id;
			objEmail.email = '';
			objEmail.subject = 'Expense Report Box Upload';
			objEmail.body = 'Expense Report Box Upload';
			//***updated 25 Feb 2021
			objEmail.attachments = arrAttachment;
			objEmail.relatedrecord = {transactionId: newRec.id};
			//***
			
			suitebox.emailUpload(objEmail, sRecType);
			
		}
		catch(err){
			log.audit('expensereport.uploadExpenseReport', err);
		}
		
		//***
	};
	
    return {
    	
    	uploadExpenseReport: uploadExpenseReport
    };
    
});
