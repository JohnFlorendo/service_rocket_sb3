/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/file', 'N/query', '../../SuitePDF/api/letter'],

    function (runtime, file, query, letter) {

        /**
         * Marks the beginning of the Map/Reduce process and generates input data.
         *
         * @typedef {Object} ObjectRef
         * @property {number} id - Internal ID of the record instance
         * @property {string} type - Record type id
         *
         * @return {Array|Object|Search|RecordRef} inputSummary
         * @since 2015.1
         */
        getInputData = function () {

            var idPromoCycle = runtime.getCurrentScript().getParameter({ name: 'custscript_addjustmentcycleid' });
            var arrSql = (file.load({ id: './sql/adjustmentcycleuploadmr.sql' }).getContents()).split('{{}}');
            var arrInput = query.runSuiteQL(arrSql[0].replace('{{id}}', idPromoCycle)).asMappedResults();
            
            log.audit({
            	title: 'getInputData', 
            	details: 'sql: ' + arrSql[0]
            });
            
            for (var index in arrInput) {
            	arrInput[index].key = arrInput[index].id;
            }
            
            return arrInput;
        };

        /**
         * Executes when the map entry point is triggered and applies to each key/value pair.
         *
         * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
         * @since 2015.1
         */
        map = function (context) {

            var objContext = JSON.parse(context.value);
            var mapValue = objContext;
            var mapKey = objContext.id;
            
            context.write({
                key: mapKey,
                value: mapValue
            });

        };

        /**
         * Executes when the reduce entry point is triggered and applies to each group.
         *
         * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
         * @since 2015.1
         */
        reduce = function (context) {

            var objContext = JSON.parse(context.values[0]);
            var reduceData = objContext;
            
            letter.generateSalaryAdjustment(reduceData);

        };


        /**
         * Executes when the summarize entry point is triggered and applies to the result set.
         *
         * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
         * @since 2015.1
         */
        summarize = function (summary) {

        };

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };

    });
