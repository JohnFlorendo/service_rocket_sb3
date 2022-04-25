define(['N/ui/dialog'], function(dialog) {

	getTaskTotalHoursBeforeEdit = function(currRec) {

		try {
			var nTotal = 0;

			for (var nDay = 0; nDay <= 6; nDay++) {

				var nHours = currRec.getCurrentSublistValue({sublistId: 'timeitem', fieldId: 'hours' + nDay});
				nHours = nHours || 0;
				nTotal += nHours;
			}
			window.beforetotalhours = nTotal;
		}
		catch (err) {

		}
	};

	getTaskTotalHoursAfterEdit = function(currRec) {

		try {
			var nTotal = 0;

			for (var nDay = 0; nDay <= 6; nDay++) {

				var nHours = currRec.getCurrentSublistValue({sublistId: 'timeitem', fieldId: 'hours' + nDay});
				nHours = nHours || 0;
				nTotal += nHours;
			}
			window.aftertotalhours = nTotal;
		}
		catch (err) {

		}

	};

	checkTaskRemainingHours = function(currRec) {

		try {

			var nRemaining = currRec.getCurrentSublistValue({sublistId: 'timeitem', fieldId: 'custcol_projtask_remaining'});
			var nDifference = window.aftertotalhours - window.beforetotalhours;

			if (nDifference > 0) {

				if (nDifference > nRemaining) {

					var sProjectManager = currRec.getCurrentSublistText({sublistId: 'timeitem', fieldId: 'custcol_sr_project_manager'});

					dialog.alert({
							title: 'Planned Time Exceeds.',
							message: 'The planned time has been met or will be met with additional logged time. Please confirm with the associated project manager (' + sProjectManager + ') prior to logging additional time to this task. The remaining hours before this entry is ' + nRemaining + 'hour(s).'
						}
					);
				}

			}
		}
		catch (err) {

		}
	};

	getTimeMemosBeforeEdit = function(currRec) {

		try {
			var arrMemo = [];
			window.timesheet = {};

			if (currRec.getCurrentSublistValue({sublistId: 'timeitem', fieldId: 'customer'})) {
				window.newline = false;
			}
			else {
				window.newline = true;
			}


			for (var nDay = 0; nDay <= 6; nDay++) {

				var sMemo = currRec.getCurrentSublistValue({sublistId: 'timeitem', fieldId: 'memo' + nDay});

				arrMemo[nDay] = sMemo;
			}
			window.memos = arrMemo;
			window.oldservitem = currRec.getCurrentSublistValue({sublistId: 'timeitem', fieldId: 'item'});
		}
		catch (err) {

		}
	};

	addServiceItem = function(currRec) {
		try {

			var serviceItem = currRec.getCurrentSublistValue({sublistId: 'timeitem', fieldId: 'custcol_sf_serviceitem'});
			currRec.setCurrentSublistValue({
				sublistId: 'timeitem',
				fieldId: 'item',
				value: serviceItem,
				forceSyncSourcing: true
			});
			// enableBillable(currRec);

			// var serviceItemText = currRec.getCurrentSublistText({sublistId: 'timeitem', fieldId: 'item'});
			// console.log('serviceItemText', serviceItemText);
		} catch (err) {
			console.error('Error', err);
		}

	};

	enableBillable = function(currRec) {
		var sublistObj = currRec.getSublist({ sublistId: 'timeitem' });
		var columnObj = sublistObj.getColumn({ fieldId: 'isbillable' });
		columnObj.isDisabled = false;
	}

	setTimeMemo = function(scriptContext, currRec) {

		//if (window.oldservitem == currRec.getCurrentSublistValue({sublistId: 'timeitem', fieldId: 'item'})) {
		if (window.taskpostsourcing == false && window.itempostsourcing == false) {
			var sFieldId = scriptContext.fieldId;
			var sMemo = currRec.getCurrentSublistValue({sublistId: 'timeitem', fieldId: sFieldId});
			var indxMemo = sFieldId.replace('memo', '');
			window.memos[indxMemo] = sMemo;
		}
	};

	revertTimeMemos = function(currRec) {

		var arrMemo = [];
		for (var nDay = 0; nDay <= 6; nDay++) {
			// console.log('memo'+nDay+ ':' + window.memos[nDay]);
			currRec.setCurrentSublistValue({
				sublistId: 'timeitem',
				fieldId: 'memo' + nDay,
				value: window.memos[nDay],
				ignoreFieldChange: true
			});
		}
		// enableBillable(currRec);
	};


	return {
		getTaskTotalHoursBeforeEdit: getTaskTotalHoursBeforeEdit,
		getTaskTotalHoursAfterEdit: getTaskTotalHoursAfterEdit,
		checkTaskRemainingHours: checkTaskRemainingHours,
		getTimeMemosBeforeEdit: getTimeMemosBeforeEdit,
		addServiceItem: addServiceItem,
		setTimeMemo: setTimeMemo,
		revertTimeMemos: revertTimeMemos,
		enableBillable: enableBillable
	};

});
