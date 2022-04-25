/**
 * @NApiVersion 2.x
 * @NScriptType Portlet
 * @NModuleScope SameAccount
 */
define(['N/file', 'N/ui/serverWidget', '../../Library/handlebars/handlebars', '../../Library/handlebars/handlebarshelper'],
/**
 * @param {serverWidget} serverWidget
 */
function(file, serverWidget, handlebars, handlebarshelper) {
   
    /**
     * Definition of the Portlet script trigger point.
     * 
     * @param {Object} params
     * @param {Portlet} params.portlet - The portlet object used for rendering
     * @param {number} params.column - Specifies whether portlet is placed in left (1), center (2) or right (3) column of the dashboard
     * @param {string} params.entity - (For custom portlets only) references the customer ID for the selected customer
     * @Since 2015.2
     */
	render = function (params) {

        params.portlet.title = 'MyApps';
					
		var sHTML = file.load({
			id: '../template/servicerocketapp.html'
		}).getContents();
		
		var sHandlebar = handlebars.compile(sHTML);
		handlebars = handlebarshelper.register(handlebars);
		var sFinishedHtml = sHandlebar({});
		
		params.portlet.html = sFinishedHtml;
    	
    }

    return {
        render: render
    };
    
});
