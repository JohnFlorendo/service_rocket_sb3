var objFields = {
    BOX_FOLDER_RECORD : {
        RECORD_TYPE : "customrecord_box_record_folder",
        NETSUITE_RECORD_ID : "custrecord_ns_record_id",
        BOX_FOLDER_RECORD_ID : "custrecord_box_record_folder_id",
        NETSUITE_RECORD_TYPE : "custrecord_netsuite_record_type"
    },
};

define(['N/record', 'N/search'],
/**
 * @param {record} record
 * @param {search} search
 */
function(record, search) {
	
    function getBoxFolderId(intProjectId, stRecordType) {
        var intBoxFolderId = "";

        var recSearchObj = search.create({
            type: objFields.BOX_FOLDER_RECORD.RECORD_TYPE,
            filters: [
                [objFields.BOX_FOLDER_RECORD.NETSUITE_RECORD_ID, 'is', intProjectId], 'AND',
                [objFields.BOX_FOLDER_RECORD.NETSUITE_RECORD_TYPE, 'is', stRecordType]
            ],
            columns: [ search.createColumn({name: objFields.BOX_FOLDER_RECORD.BOX_FOLDER_RECORD_ID }) ]
        });

        recSearchObj.run().each(function(result) {
            intBoxFolderId = result.getValue({name:objFields.BOX_FOLDER_RECORD.BOX_FOLDER_RECORD_ID});
            return false;
        });

        return intBoxFolderId;
    }
   
    return {
    	getBoxFolderId : getBoxFolderId
    };
    
});
