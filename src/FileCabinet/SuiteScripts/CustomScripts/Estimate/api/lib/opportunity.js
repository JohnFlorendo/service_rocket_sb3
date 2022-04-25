define(['N/record'],
    /**
     * @param {record} record
     */
    function (record) {

    updateAmount = function (newRec) {

        try {
			var idOpps = newRec.getValue({
				fieldId : 'opportunity'
			});
			var recOpps = record.load({
				type : record.Type.OPPORTUNITY,
				id : idOpps,
				isDynamic : true
			});
			recOpps.setValue({
				fieldId : 'projectedtotal',
				value : newRec.getValue({
					fieldId : 'total'
				})
			});
			var idOpps = recOpps.save();
		} 
        catch (err) {
        	
            log.audit({
                title: 'opportunity',
                details: 'updateAmount: ' + err
            });
		}
        
		return newRec;
    };

    return {
        updateAmount: updateAmount
    };

});