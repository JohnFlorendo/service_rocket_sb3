define(['N/record',  '../../../NetSpot/api/netspot'],
    
	function (record, netspot) {

    /**
     * Updates margin information of the Estimate.
     * Updates margin information and projectedtotal of the related Opportunity.
     * Triggers netspot.update deal to synch related HS deal.
     *
     * @param {record} record
     * @param {netspot} netspot
     * @Since 10/12/2021
     */

    computeMargin = function (newRec) {

        try {

            var nTotalAmount = newRec.getValue({
                fieldId: 'total'
            }) - newRec.getValue({
                fieldId: 'taxtotal'
            });

            if (newRec.getValue({
                    fieldId: 'tax2total'
                })) {
            	
                nTotalAmount -= newRec.getValue({
                    fieldId: 'tax2total'
                });
            }

            var nNavyCost = newRec.getValue({
                fieldId: 'custbody_nvy_cost'
            });
            
            var nFxRate = 1;
            
            if(newRec.getValue({
                fieldId: 'custbody_nvy_usd_fxrate'
            }) > 0){
            	
            	nFxRate = 1 / newRec.getValue({
                    fieldId: 'custbody_nvy_usd_fxrate'
                });	
            }
            
            var nCustomerAmount = nTotalAmount * nFxRate;
            var nMargin = nCustomerAmount - nNavyCost;
            var nPercent = (nMargin / nCustomerAmount) * 100;

            newRec.setValue({
                fieldId: 'custbody_nvy_margin',
                value: nMargin
            });
            newRec.setValue({
                fieldId: 'custbody_nvy_marginpercent',
                value: nPercent
            });
            
    		var idOpps = newRec.getValue({
    		    fieldId: 'opportunity'
    		});
    		var nCost = newRec.getValue({
    		    fieldId: 'custbody_nvy_cost'
    		});
    		var nMargin = newRec.getValue({
    		    fieldId: 'custbody_nvy_margin'
    		});
    		var nPercent = newRec.getValue({
    		    fieldId: 'custbody_nvy_marginpercent'
    		});
    		
    		var nTotal = newRec.getValue({
                fieldId: 'total'
            });

    		var idEstimate = newRec.save();
    		
    		var recOpps = record.load({
    		    type: 'opportunity',
    		    id: idOpps,
    		    isDynamic: true
    		});

    		recOpps.setValue({
    		    fieldId: 'custbody_nvy_cost',
    		    value: nCost
    		});
    		recOpps.setValue({
    		    fieldId: 'custbody_nvy_margin',
    		    value: nMargin
    		});
    		recOpps.setValue({
    		    fieldId: 'custbody_nvy_marginpercent',
    		    value: nPercent
    		});
    		
    		recOpps.setValue({
    		    fieldId: 'projectedtotal',
    		    value: nTotal
    		});

     		log.audit({
    		    title: 'margin.computeMargin ',
    		    details: 'Projected Total: ' + recOpps.getValue({
    		    	fieldId: 'projectedtotal'
    		    })
    		});

    		var idOpps = recOpps.save();
    		
    		var recOpps = record.load({
    		    type: 'opportunity',
    		    id: idOpps,
    		    isDynamic: true
    		});
    		
    		result = netspot.updateDeal({record: recOpps});
    		
    		var id = result.record.save();
            
        }
        catch (err) {
            log.audit({
                title: 'margin',
                details: 'computeMargin: ' + err
            });
        }

        return newRec;

    };

    return {
        computeMargin: computeMargin
    };

});