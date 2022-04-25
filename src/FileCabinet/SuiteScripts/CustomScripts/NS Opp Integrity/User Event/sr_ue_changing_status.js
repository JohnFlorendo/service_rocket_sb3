/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search', 'N/runtime'],
    /**
     * @param{record} record
     * @param{search} search
     * @param{runtime} runtime
     */
    (record, search, runtime) => {
        var Closed_Lost = 14;
        var objRuntime = runtime.getCurrentScript();

        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
            if (scriptContext.type === 'create') {
                log.debug('Start');
                var newRecord = scriptContext.newRecord;

                var inOpportunity = newRecord.getValue('opportunity');
                var inEstimate = newRecord.getValue('createdfrom');

                var arrEstimate = searchOpportunityWithEstimate(inOpportunity, inEstimate);

                for (var indxEstimate in arrEstimate) {
                    var recEstimate = record.load({
                        type: record.Type.ESTIMATE,
                        id: arrEstimate[indxEstimate],
                        isDynamic: true
                    });

                    recEstimate.setValue({
                        fieldId: 'entitystatus',
                        value: Closed_Lost
                    });

                    var recEstimateId = recEstimate.save();
                    log.debug('End', recEstimateId);
                    log.debug("Every recEstimateId: ", objRuntime.getRemainingUsage());
                }

                log.debug("Remaining usage units: ", objRuntime.getRemainingUsage());
            }
        }

        function searchOpportunityWithEstimate(inOpportunity, inEstimate) {
            var arrEstimate = [];
            var searchObjStatus = search.create({
                type: "transaction",
                filters:
                    [
                        ["type", "anyof", "Opprtnty"],
                        "AND",
                        ["internalid", "anyof", inOpportunity],
                        "AND",
                        ["applyingtransaction.type", "anyof", "Estimate"],
                        "AND",
                        ["applyingtransaction.internalid", "noneof", inEstimate]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            join: "applyingTransaction",
                            label: "Internal ID"
                        })
                    ]
            });

            searchObjStatus.run().each(function (result) {
                var inEstimate = result.getValue({
                    name: "internalid",
                    join: "applyingTransaction"
                });
                arrEstimate.push(inEstimate);

                return true;
            });

            return arrEstimate;
        }

        return {afterSubmit}

    });
