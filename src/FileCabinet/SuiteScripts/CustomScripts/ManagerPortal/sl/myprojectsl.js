/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/query', 'N/file', 'N/search', 'N/ui/serverWidget', '../api/timeoff', '../../Library/handlebars', '../../Helper/nstojson'],
	/**
	 * @param {file} file
	 * @param {serverWidget} serverWidget
	 */
	function (record, runtime, query, file, search, serverWidget, timeoff, handlebars, nstojson) {

		/**
		 * Definition of the Suitelet script trigger point.
		 *
		 * @param {Object} context
		 * @param {ServerRequest} context.request - Encapsulation of the incoming request
		 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
		 * @Since 2015.2
		 */

	onRequest = function (context) {

			var paramReq = context.request.parameters;
			var idMe = runtime.getCurrentUser().id;
			var idProject = paramReq.projectinternalid;
			var idEntity = paramReq.projectid;
			var sAction = paramReq.action;
			var sTemplate = file.load({
								id: '../template/myprojects_v1_3.html'
							}).getContents();
			
			var arrSql = file.load(208415).getContents().split('{{}}');
		
			if (sAction == 'backend') {
				
				var sList = paramReq.list;
				var idMeParam = paramReq.idme;

				if (idMeParam != undefined && sList == 'project'){
					
					var arrProjects = query.runSuiteQL({query: arrSql[3], params: [idMeParam]}).asMappedResults();
					context.response.write(JSON.stringify({data: arrProjects}));
				}
				else if (idMeParam == undefined && sList == 'project'){
					var arrProjects = query.runSuiteQL({query: arrSql[0], params: [idMe]}).asMappedResults();
					context.response.write(JSON.stringify({data: arrProjects}));
				}
			}
			else if (idProject == undefined && idEntity == undefined) {
			
				sTemplate = file.load(216814).getContents();
				
				var objForm = serverWidget.createForm({
					title: 'MyProjects 1.3'
				});
				
				var fldHtml = objForm.addField({
					id: 'custpage_htmlfield',
					type: serverWidget.FieldType.INLINEHTML,
					label: 'HTML Image'
				});
				
				var sHandlebar = handlebars.compile(sTemplate);
				
				var sHtmlTemplate = sHandlebar({idme: idMe});

				fldHtml.defaultValue = sHtmlTemplate;

				context.response.writePage(objForm);
			}
			else if (idProject != undefined || idEntity != undefined) {
			
				var idProject = paramReq.projectinternalid ? paramReq.projectinternalid: 0;
				var idEntity = paramReq.projectid ? paramReq.projectid: '-';
				
				
				var objForm = serverWidget.createForm({
					title: 'MyProjects 1.3'
				});

				var fldHtml = objForm.addField({
					id: 'custpage_htmlfield',
					type: serverWidget.FieldType.INLINEHTML,
					label: 'HTML Image'
				});

				var sHandlebar = handlebars.compile(sTemplate);

				handlebars.registerHelper('if_even',
					function (conditional) {

						if ((conditional % 2) == 0) {
							return 'left';
						} else {
							return 'right';
						}
					});

				handlebars.registerHelper('currency', 
					function (value) {
						if (value == null) {
							return '0.00';
						}
						else {
							return value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
						}
					});
				
				handlebars.registerHelper('isboolean', 
						function (value) {
							if (value == 'T' || value == 't') {
								return true;
							}
							else if(value == 'Yes' || value == 'yes' || value == 'YES'){
								return true;
							}
							else if(value == 'True' || value == 'true' || value == 'TRUE'){
								return true;
							}
							else {
								return false;
							}
						});
				
				handlebars.registerHelper('greaterthan', 
						function (value, reference) {
							if (value > reference) {
								return true;
							}
							else {
								return false;
							}
						});

				handlebars.registerHelper('loop', 
						function (value, string) {
					
							retMe = '';
				    		for(var i = 1; i < value; ++i){
				    			retMe += string;
				    		}
				    			
				    		return retMe;
						});
				
				var objJSON = query.runSuiteQL({
					query: arrSql[0], 
					params: [idProject, idEntity, idMe]
				}).asMappedResults()[0];

				var sHtmlTemplate = '';
				
				if(objJSON){
					
					objJSON.team = query.runSuiteQL({query: arrSql[1], params: [idProject, idEntity]}).asMappedResults();
					
					var arrTask = query.runSuiteQL({query: arrSql[2], params: [idProject, idEntity]}).asMappedResults();
					
					arrTask.forEach(function (task) {
					    
						if(task.parent == null || task.parent == ''){
							task.level = 1;
						}
						else{
							
							var objParent = arrTask.filter(function(parenttask) {
								return parenttask.internalid == task.parent;
							});
							
							task.level = objParent[0].level + 1;
						}
						
					});
					
					objJSON.tasks = arrTask;
					
					sHtmlTemplate = sHandlebar(objJSON);
				}
				else{
					sHtmlTemplate = 'Project not found!';
				}
				

				fldHtml.defaultValue = sHtmlTemplate;

				context.response.writePage(objForm);
			}
		}

		return {
			onRequest: onRequest
		};

	});

