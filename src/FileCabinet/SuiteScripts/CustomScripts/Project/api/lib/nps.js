define(['N/record', 'N/query', 'N/search', '../../../NetSpot/api/netspot', '../../../Library/momentjs/moment'],
/**
 * @param {record} record
 */
function(record, query, search, netspot, moment) {
	
	checkContacts = function(option){
		
		var recProject = option.record;
		
		if(recProject.getValue('custentity4') != 7){
			return true;
		}
		
		var src = search.create({
		    type: 'contact',
		    columns: ['custentity_hubspot_id']
		});

		src.filters = [];
		
		src.filters.push(search.createFilter({
	        name: 'internalid',
	        join: 'job',
	        operator: search.Operator.ANYOF,
	        values: option.record.id
	    }));
		
		src.filters.push(search.createFilter({
	        name: 'role',
	        operator: search.Operator.ANYOF,
	        values: 5 //NPS Contact Role
	    }));
		
		var scrResultSet = src.run();
		var srcResult = scrResultSet.getRange({
		    start: 0,
		    end: 1
		});
		
		if(srcResult.length > 0){
			return true;
		}
		else{
			return false;
		}
	};
	
	send = function(option){
		
		var recProject = option.newrecord;
		var oldProject = option.oldrecord;
		var dToday = moment();
		var dInProgress = moment();
		var dStart = moment();
		var dClosed = moment();
		var dPost = moment();
		var arrData = [];
		
		if(recProject.getValue('custentity4') != 7){
			return true;
		}

		if (recProject.getValue('entitystatus') == 2 && 
				oldProject.getValue('entitystatus') != 2){
			
			var sSql = "SELECT newvalue, oldvalue " +
				"FROM systemnote " +
				"WHERE recordtypeid = -9 " + 
					"AND field = 'CUSTJOB.KENTITYSTATUS' " +
					"AND newvalue = 'PROJECT-Execution' " +
					"AND recordid  = " + recProject.id + " "+ 
				"ORDER BY id DESC";
			
			var arrSystnotes = query.runSuiteQL({
    			query: sSql,
    		}).asMappedResults();
			
			if(arrSystnotes.length > 1){
				
				log.audit({
	        		title: 'nps', 
	        		details: 'not first execution'
	        	});
				
				return;
			}

			dInProgress = dInProgress.add(90, 'days').format('YYYY-MM-DD');
			dStart = dStart.day(9).format('YYYY-MM-DD');
			dPost = '';
			dClosed = '';
		}
		else if(recProject.getValue('entitystatus') == 1 && 
				oldProject.getValue('entitystatus') != 1){
			
			var sSql = "SELECT newvalue, oldvalue " +
				"FROM systemnote " +
				"WHERE recordtypeid = -9 " + 
					"AND field = 'CUSTJOB.KENTITYSTATUS' " +
					"AND newvalue = 'PROJECT-Closed' " +
					"AND recordid  = " + recProject.id + " "+ 
				"ORDER BY id DESC";
			
			var arrSystnotes = query.runSuiteQL({
				query: sSql,
			}).asMappedResults();
			
			if(arrSystnotes.length > 1){
				
				log.audit({
	        		title: 'nps', 
	        		details: 'not first closed'
	        	});
				
				return;
			}
			
			dClosed = dClosed.day(9).format('YYYY-MM-DD');
			
			if(dToday.add(45, 'days').day() <=2){
				dPost = dPost.add(45, 'days').day(2).format('YYYY-MM-DD');
			}
			else{
				dPost = dPost.add(45, 'days').day(9).format('YYYY-MM-DD');
			}
			
			dInProgress = '';
			dStart = '';
			
			log.audit({
        		title: 'nps', 
        		details: 'first execute/closed'
        	});
			
		}
		else{
			return;
		}
		
		var src = search.create({
		    type: 'contact',
		    columns: ['custentity_hubspot_id']
		});

		src.filters = [];
		
		src.filters.push(search.createFilter({
	        name: 'internalid',
	        join: 'job',
	        operator: search.Operator.ANYOF,
	        values: recProject.id
	    }));
		
		
		src.run().each(function(result) {
			
            arrData.push({
    		    id: result.getValue({
                    name: 'custentity_hubspot_id'
                }),
    		    properties: {
    		    	psnpssurveystart: dStart,
    		    	psnpssurveyinprogress: dInProgress,
    		    	psnpssurveypost: dPost,
    		    	send_ps_nps_survey_for_end_of_project_on_date: dClosed
    		    }
    		});
            
            return true;
        });
	
		var retMe = netspot.updateContact({
			usemap: false,
			data: {
				inputs: arrData
			}
		});
		
		var x =1 ;
	};
   
    return {
		send: send,
		checkContacts: checkContacts
    };
    
});
