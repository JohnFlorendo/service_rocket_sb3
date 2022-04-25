define(['N/file', 'N/query'],
/**
 * @param {file} file
 */
function(file, query) {
   
	get = function(option){
		
		
		var x = file.load({
			id: 241815 //myavailability.sql
		}).getContents().replace(/{{id}}|{{hrmanager}}|{{manager}}/g, 
				function(s){
			return option[s];
		})
		
		var arrRawData = query.runSuiteQL({
			query: file.load({
				id: 241815 //myavailability.sql
			}).getContents().replace(/{{id}}|{{hrmanager}}|{{manager}}/g, 
					function(s){
				return option[s];
			})
			//, params: option.id
		}).asMappedResults();	
		
		var sCategory = '';
		
		var arrCategories = [];
		
		var arrSeries = [{
	        name: 'Work Calendar',
	        color: 'rgb(218,217,215)',
	        data: [],
	        pointPadding: 0.3,
	        pointPlacement: -0.2
	    }, {
	        name: 'Unallocated',
	        color: 'rgb(255,181,33)',
	        data: [],
	        pointPadding: 0.4,
	        pointPlacement: -0.2,
	        stacking: 'normal'
	    },{
	        name: 'Time-off',
	        color: 'rgb(0,95,237)',
	        data: [],
	        pointPadding: 0.4,
	        pointPlacement: -0.2,
	        stacking: 'normal'
	    }, {
	        name: 'Project Allocations',
	        color: 'rgb(0,100,0)',
	        data: [],
	        pointPadding: 0.4,
	        pointPlacement: -0.2,
	        stacking: 'normal'
	    }];
		
		if(arrRawData.length > 0){
			
			for (var key in arrRawData[0]) {
				
				if (key.indexOf('_xcategory') > -1) {
					sCategory = key;
			    }
			}
			
			arrRawData.forEach(function(data, idx, arrdata) {
				arrCategories.push(data[sCategory]); 
				arrSeries[0].data.push(data.workcalendar);
				arrSeries[1].data.push(data.unallocated);
				arrSeries[2].data.push(data.timeoff);
				arrSeries[3].data.push(data.allocation);
			});
			
			return {xcategories: arrCategories, series: arrSeries};
		}
		else{
			return {xcategories: [], series: []};
		}
		
		
		
	};
	
    return {
    	get: get
    };
    
});
