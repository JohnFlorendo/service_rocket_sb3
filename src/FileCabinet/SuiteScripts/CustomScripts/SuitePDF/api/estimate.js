define(['N/record', 'N/search', 'N/file', './lib/atlassiannavy', './lib/digitalai', './lib/sow'],

function(record, search, file, atlassiannavy, digitalai, sow) {
   
	function generate(recPrint) {
		
		var sTemplate = '';
		
		if(recPrint.getValue({fieldId: 'custbody_quote_type'}) == 2){
			sTemplate = sow.generate(recPrint);
		}
		else if(recPrint.getValue({fieldId: 'custbody_quote_type'}) == 4){
			sTemplate = digitalai.generate(recPrint);
		}
		else{
			sTemplate = atlassiannavy.generate(recPrint);	
		}
		
		return sTemplate;
	}
	
    return {
    	generate: generate
    };
    
});
