/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record'],
    /**
     * @param{search} search
     * @param{currentRecord} currentRecord
     */
    function (search, record) {

        function pageInit(scriptContext) {
            var currRecord = scriptContext.currentRecord;
            if (currRecord.getValue('entity')) {
                creatingPurchaseOrderFromRequisition(scriptContext);
            }
        }

        function postSourcing(scriptContext) {
            if (scriptContext.fieldId == 'entity') {
                setTimeout(function () {
                    creatingPurchaseOrderFromRequisition(scriptContext);
                }, 500);
            }
        }

        function creatingPurchaseOrderFromRequisition(scriptContext) {
            var currRecord = scriptContext.currentRecord;

            var stTransform = currRecord.getValue({
                fieldId: 'transform'
            });

            if (stTransform) {
                setExpiryDate(currRecord);
                setBudgetCode(currRecord);
                settingLineItem(currRecord);
            }
        }

        function setExpiryDate(currRecord) {
            var dtDate = currRecord.getValue({
                fieldId: 'trandate'
            });

            // dtDate.setMonth(dtDate.getMonth() + 1)
            dtDate.setFullYear(dtDate.getFullYear() + 1)
            currRecord.setValue({
                fieldId: 'custbody_sr_expiry_date',
                value: dtDate
            });
        }

        function setBudgetCode(currRecord) {
            var inRequisitionId = currRecord.getValue({
                fieldId: 'createdfrom'
            });
            var stRequisitionNumber = search.lookupFields({
                type: search.Type.PURCHASE_REQUISITION,
                id: inRequisitionId,
                columns: ['tranid']
            });
            currRecord.setValue({
                fieldId: 'custbody_sr_budget_code',
                value: stRequisitionNumber.tranid
            });
        }

        function settingLineItem(currRecord) {
            var inRequisitionId = currRecord.getValue({
                fieldId: 'createdfrom'
            });

            var arrData = recordRequisitionLineItems(currRecord, inRequisitionId);

            for (var indxArrData = 0; indxArrData < arrData.length; indxArrData++) {
                console.log('JSON.stringify(arrData[indxArrData])): ' + JSON.stringify(arrData[indxArrData]));
                var valueField = arrData[indxArrData];
                var inLine = currRecord.getLineCount({
                    sublistId: 'item'
                });
                for (var indx = 0; indx < inLine; indx++) {
                    if (indx == indxArrData) {
                        setLineItem(currRecord, indx, valueField);
                    }
                }
            }
        }

        function setLineItem(currRecord, indx, valueField) {
            currRecord.selectLine({
                sublistId: 'item',
                line: indx
            });
            currRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                value: valueField.inItem,
                ignoreFieldChange: true
            });
            currRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'rate',
                value: valueField.inEstimatedRate,
                ignoreFieldChange: true
            });
            currRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'amount',
                value: valueField.inEstimatedAmount,
                ignoreFieldChange: true
            });

            var inGSTAmount = currRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_gst_amount'
            });
            var inGrossAmount = valueField.inEstimatedAmount + inGSTAmount;
            currRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'grossamt',
                value: inGrossAmount,
                ignoreFieldChange: true
            });
            currRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'taxcode',
                value: valueField.inGSTCode,
                ignoreFieldChange: true
            });

            currRecord.commitLine({
                sublistId: 'item'
            });
        }

        function recordRequisitionLineItems(currRecord, inRequisitionId) {
            var objData = {};
            var arrData = [];

            var recRequisition = record.load({
                type: record.Type.PURCHASE_REQUISITION,
                id: inRequisitionId,
                isDynamic: true,
            });

            var inLine = recRequisition.getLineCount({
                sublistId: 'item'
            });
            for (var indx = 0; indx < inLine; indx++) {
                objData = {
                    inItem: recRequisition.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: indx
                    }),
                    inEstimatedRate: recRequisition.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'estimatedrate',
                        line: indx
                    }),
                    inEstimatedAmount: recRequisition.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'estimatedamount',
                        line: indx
                    }),
                    inGSTCode: recRequisition.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_gst_taxcode',
                        line: indx
                    })
                }
                arrData.push(objData);
            }

            return arrData;
        }

        return {
            pageInit: pageInit,
            postSourcing: postSourcing
        };

    });
