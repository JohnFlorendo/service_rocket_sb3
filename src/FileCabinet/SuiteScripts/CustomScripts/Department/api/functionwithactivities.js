define(['N/record', 'N/file', '../../Helper/nstojson', '../../Library/handlebars'],
/**
 * @param {record} record
 */
function(record, file, nstojson, handlebars) {
	
	generate = function (idRecord) {
		
		var recFunction = record.load({type: 'customrecord_sr_function', id: idRecord, isDynamic: true});
		
		
		var objFunction = nstojson.get(recFunction);
		
		var sTemplate = file.load(130929);
		var sHandlebar = handlebars.compile(sTemplate.getContents());
    	var sHtmlTemplate = sHandlebar(objFunction);

    	//context.response.write(sHtmlTemplate);

    	//context.response.write(JSON.stringify(objDepartments));
    	//context.response.writePage(objForm);
		
		return sHtmlTemplate;
	}
	
    return {
    	generate : generate
    };
    
});
