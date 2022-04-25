/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/runtime', 'N/query', '../api/timesheet'],
	/**
	 * @param {currentRecord} currentRecord
	 * @param {runtime} runtime
	 * @param {query} query
	 */
	function(currentRecord, runtime, query, timesheet) {
		var Professional_Services = 7;

		/**
		 * Function to be executed after page is initialized.
		 *
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.currentRecord - Current form record
		 * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
		 *
		 * @since 2015.2
		 */
		function pageInit(scriptContext) {
			var currentRecord = scriptContext.currentRecord;
			window.taskpostsourcing = false;
			window.itempostsourcing = false;
			timesheet.getTimeMemosBeforeEdit(currentRecord);
			timesheet.enableBillable(currentRecord);
		}

		/**
		 * Function to be executed when field is changed.
		 *
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.currentRecord - Current form record
		 * @param {string} scriptContext.sublistId - Sublist name
		 * @param {string} scriptContext.fieldId - Field name
		 * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
		 * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
		 *
		 * @since 2015.2
		 */
		function fieldChanged(scriptContext) {

			if(scriptContext.fieldId.includes('hour') && scriptContext.sublistId == 'timeitem'){

				var currRec = currentRecord.get();
				var idTask = currRec.getCurrentSublistValue({sublistId: scriptContext.sublistId, fieldId: 'casetaskevent'});

				if(idTask ){
					timesheet.getTaskTotalHoursAfterEdit(currRec);
					timesheet.checkTaskRemainingHours(currRec);
				}
			}

			if(scriptContext.fieldId.includes('memo') && scriptContext.sublistId == 'timeitem') {
				var currRec = currentRecord.get();
				if(window.taskpostsourcing== false && window.itempostsourcing == false){
					timesheet.setTimeMemo(scriptContext, currRec);
				}
			}

			if(scriptContext.fieldId == 'item' && scriptContext.sublistId == 'timeitem') {
				window.itempostsourcing = true;
				setTimeout(function(){
					var currRec = currentRecord.get();
					timesheet.revertTimeMemos(currRec);
					window.itempostsourcing = false;
				},500);
			}
		}

		/**
		 * Function to be executed when field is slaved.
		 *
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.currentRecord - Current form record
		 * @param {string} scriptContext.sublistId - Sublist name
		 * @param {string} scriptContext.fieldId - Field name
		 *
		 * @since 2015.2
		 */
		function postSourcing(scriptContext) {

			if(scriptContext.fieldId =='casetaskevent'){

				// console.log('memos: ' + JSON.stringify(window.memos));

				var currRec = currentRecord.get();
				var idTask = currRec.getCurrentSublistValue({sublistId: scriptContext.sublistId, fieldId: 'casetaskevent'});

				window.taskpostsourcing = true;
				timesheet.revertTimeMemos(currRec);

				if(idTask){
					window.beforetotalhours = 0;
					timesheet.getTaskTotalHoursAfterEdit(currRec);
					timesheet.checkTaskRemainingHours(currRec);
					timesheet.addServiceItem(currRec);

					window.taskpostsourcing = false;
				}

				// console.log('post sourcing task');
			}

		}

		/**
		 * Function to be executed after sublist is inserted, removed, or edited.
		 *
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.currentRecord - Current form record
		 * @param {string} scriptContext.sublistId - Sublist name
		 *
		 * @since 2015.2
		 */
		function sublistChanged(scriptContext) {

		}

		/**
		 * Function to be executed after line is selected.
		 *
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.currentRecord - Current form record
		 * @param {string} scriptContext.sublistId - Sublist name
		 *
		 * @since 2015.2
		 */
		function lineInit(scriptContext) {

			if(scriptContext.sublistId == 'timeitem'){

				var currRec = currentRecord.get();
				var idTask = currRec.getCurrentSublistValue({sublistId: scriptContext.sublistId, fieldId: 'casetaskevent'});

				if(idTask){
					timesheet.getTaskTotalHoursBeforeEdit(currRec);
				}
				timesheet.getTimeMemosBeforeEdit(currRec);
			}
		}

		/**
		 * Validation function to be executed when field is changed.
		 *
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.currentRecord - Current form record
		 * @param {string} scriptContext.sublistId - Sublist name
		 * @param {string} scriptContext.fieldId - Field name
		 * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
		 * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
		 *
		 * @returns {boolean} Return true if field is valid
		 *
		 * @since 2015.2
		 */
		function validateField(scriptContext) {

		}

		/**
		 * Validation function to be executed when sublist line is committed.
		 *
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.currentRecord - Current form record
		 * @param {string} scriptContext.sublistId - Sublist name
		 *
		 * @returns {boolean} Return true if sublist line is valid
		 *
		 * @since 2015.2
		 */
		function validateLine(scriptContext) {

		}

		/**
		 * Validation function to be executed when sublist line is inserted.
		 *
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.currentRecord - Current form record
		 * @param {string} scriptContext.sublistId - Sublist name
		 *
		 * @returns {boolean} Return true if sublist line is valid
		 *
		 * @since 2015.2
		 */
		function validateInsert(scriptContext) {

		}

		/**
		 * Validation function to be executed when record is deleted.
		 *
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.currentRecord - Current form record
		 * @param {string} scriptContext.sublistId - Sublist name
		 *
		 * @returns {boolean} Return true if sublist line is valid
		 *
		 * @since 2015.2
		 */
		function validateDelete(scriptContext) {

		}

		/**
		 * Validation function to be executed when record is saved.
		 *
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.currentRecord - Current form record
		 * @returns {boolean} Return true if record is valid
		 *
		 * @since 2015.2
		 */
		function saveRecord(scriptContext) {
			var currentRecord = scriptContext.currentRecord;
			var errorMessage = "";
			for(var intIndex=0; intIndex<currentRecord.getLineCount({sublistId: 'timeitem'}); intIndex++) {
				var hasTimeOffRequest = false;
				for(var intIndexMemo=0; intIndexMemo<=6; intIndexMemo++) {
					var stMemo = currentRecord.getSublistValue({sublistId:"timeitem", fieldId:"memo"+intIndexMemo, line:intIndex});
					if(stMemo.indexOf("time-off request") != -1) { hasTimeOffRequest = true; }
				}

				log.audit("hasTimeOffRequest", hasTimeOffRequest);

				if(!hasTimeOffRequest) {
					var arrErrors = [];

					var inCustomer = currentRecord.getSublistValue({sublistId:"timeitem", fieldId:"customer", line:intIndex});
					var stItem = currentRecord.getSublistValue({sublistId:"timeitem", fieldId:"item", line:intIndex});

					if(!inCustomer) { arrErrors.push("Customer"); }
					if(!stItem) { arrErrors.push("Item"); }

					var inLineOfBusiness = checkProjectLineOfBusinessField(inCustomer);
					console.log('inLineOfBusiness: '+inLineOfBusiness);
					if (inLineOfBusiness == Professional_Services) {
						var stCaseTaskEvent = currentRecord.getSublistValue({sublistId:"timeitem", fieldId:"casetaskevent", line:intIndex});
						if(!stCaseTaskEvent) { arrErrors.push("Case/Task/Event"); }
					}

					if(arrErrors.length != 0) {
						errorMessage +=  "Select value for "+arrErrors.join()+" under lines #" + parseInt(intIndex+1)+".\n"
					}
				}
			}

			if(errorMessage) {
				alert(errorMessage);
				return false;
			}
			return true;
		}

		function checkProjectLineOfBusinessField(inCustomer) {
			var arrData = query.runSuiteQL({
				query: 'SELECT job.custentity4 FROM job WHERE job.id = ?',
				params: [inCustomer]
			}).asMappedResults();

			return arrData[0].custentity4;
		}

		return {
			pageInit: pageInit,
			fieldChanged: fieldChanged,
			postSourcing: postSourcing,
			lineInit: lineInit,
			saveRecord: saveRecord
		};

	});
