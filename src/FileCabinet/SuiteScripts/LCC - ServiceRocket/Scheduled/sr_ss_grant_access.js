/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/search'],
    /**
     * @param{record} record
     * @param{search} search
     */
    (record, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            try {
                var arrEmployee = searchEmployee();
                log.debug('arrEmployee', arrEmployee);

                for (var indxEmployee in arrEmployee) {
                    var recEmployee = record.load({
                        type: record.Type.EMPLOYEE,
                        id: arrEmployee[indxEmployee],
                        isDynamic: true
                    });
                    log.debug('recEmployee', recEmployee.getValue('id'));

                    // recEmployee.setValue({
                    //     fieldId: 'giveaccess',
                    //     value: true
                    // });
                    // log.debug('Give Access', recEmployee.getValue('giveaccess'));

                    var inLine = recEmployee.getLineCount({
                        sublistId: 'roles'
                    });
                    log.debug('inLine', inLine);
                    for (var indx = 0; indx < inLine; indx++) {
                        var inLineNumber = recEmployee.selectNewLine({
                            sublistId: 'roles',
                            line: indx
                        });
                        log.debug('indx', indx);
                        recEmployee.setCurrentSublistValue({
                            sublistId: 'roles',
                            fieldId: 'selectedrole',
                            value: 1326,
                            ignoreFieldChange: true
                        });
                        recEmployee.setCurrentSublistValue({
                            sublistId: 'roles',
                            fieldId: 'selectedrole',
                            value: 1304,
                            ignoreFieldChange: true
                        });
                        recEmployee.commitLine({
                            sublistId: 'roles'
                        });
                    }

                    var recEmployeeId = recEmployee.save();
                    log.debug('End', recEmployeeId);
                }
            } catch (e) {
                log.debug('error -> execute', e);
            }
        }

        function searchEmployee() {
            var arrEmployee = [];

            var employeeSearchObj = search.create({
                type: "employee",
                filters:
                    [
                        // ["internalid", "anyof", "1060235", "1060647", "1061952", "1060643", "8539", "557", "7130"]
                        // ["internalid", "anyof", "1060647", "1061952", "1060643", "8539", "557", "7130"]
                        ["internalid", "anyof", "8539", "557", "7130", "9022"]
                    ],
                columns:
                    [
                        search.createColumn({name: "internalid", label: "Internal ID"})
                    ]
            });
            employeeSearchObj.run().each(function (result) {
                var inInternalId = result.getValue({
                    name: 'internalid'
                });
                arrEmployee.push(inInternalId);

                return true;
            });

            return arrEmployee;
        }

        return {execute}

    });
