define(['N/search', 'N/query'],
/**
 * @param {search} search
 */
function(search, query) {

	
	setOrgLink = function(option){
		
		var nTree = option.tree;
	
        var src = search.create({
            type: 'employee',
            columns: ['internalid']
        });
        
        src.filters = [];
        src.filters.push(search.createFilter({
                name: 'custentity_employeetree',
                operator: search.Operator.EQUALTO,
                values: 0
            }));
		
        src.run();
        
		
		
	};
	
	getFamily = function(){
		
		var retMe;
		
        var src = search.load({
            id: 'customsearch_managerlist'
        });

        var res = getAllResults(src);

        var arrOrg = [];

        res.forEach(function (result) {

            var idSuperVisor = result.getValue('supervisor');
            var sSupervisor = result.getText('supervisor');

            arrOrg.push({
                id: parseInt(result.id),
                name: result.getValue('entityid'),
                parentid: idSuperVisor,
                team: [],
                ids: []
            });

            return true;
        });

        retMe = createDataTree(arrOrg);
        
        return retMe;
	};
	   
    createDataTree = function(employees) {
		
        var hashTable = {};
		
        employees.forEach(function(employee){
			hashTable[employee.id] = employee;
		});
		
		var retMe = [];

		employees.forEach(function(employee){
			
			if (employee.parentid){
				
				try{
	                var idParent = employee.parentid
	                var idEmployee = employee.id
	                var team = hashTable[idEmployee]
	                delete team['parentid']

	                
	                hashTable[idParent].team.push(team);
	                hashTable[idParent].ids.push(idEmployee);
	                hashTable[idParent].ids = hashTable[idParent].ids.concat(team.ids)		
				}
				catch (err){
				

	                log.audit({ 
	                	title: 'createDataTree', 
	                	details: 'idParent: ' + idParent  + ' is inactive.'
	                });
					
				}
				

				
				//hashTable[employee.parentid].team.push(hashTable[employee.id]);
			}
			else{
				retMe.push(hashTable[employee.id]);
			}
		});

        return retMe;
    };
    
    getDirectTeam = function (option) {
		
	    var retMe;
		
	    JSON.stringify(option.list, function(_, nestedValue){
			if (nestedValue && nestedValue[option.key] === option.value) {
				retMe = nestedValue;
	        }
	        return nestedValue;
		});
	    
	    var arrTeam = [{
	        id: option.value,
	        name: 'Me'
	    }];
	    var arrIds = [option.value];
	    var arrNames = ['Me'];
	    
	    retMe.team.forEach(function (employee) {
	    	arrTeam.push({
	    	    id: employee.id,
	    	    name: employee.name
	    	});
	    	arrIds.push(employee.id);
	    	arrNames.push(employee.name);
	    	
	    });

	    retMe = {
	    		team : arrTeam,
	    		ids: arrIds,
	    		name: arrNames
	    	};
		
	    return retMe;
	};
	
	getAllTeam = function (option) {
		
	    var retMe;
		
	    JSON.stringify(option.list, function(_, nestedValue){
			if (nestedValue && nestedValue[option.key] === option.value) {
				retMe = nestedValue;
	        }
	        return nestedValue;
		});
		
	    return retMe.ids;
	};
	
	getTimeOffs = function(option){
		
		var retMe;
		
        var qry = query.load({
            id: 'custdataset_timeoffraw'
        });

        var arrConditions = [];
        
        option.conditions.forEach(function(condition){
        	
        	arrConditions.push (qry.createCondition({
                fieldId: condition.field,
                operator: condition.operator,
                values: condition.values
            }));
        });
       
        qry.condition= qry.and(arrConditions);
        
        var results = query.runSuiteQL(qry.toSuiteQL().query).asMappedResults();
		
		return retMe;
		
	};
    
	getAllResults = function (s) {
		
        var results = s.run();
        var searchResults = [];
        var searchid = 0;
        do {
            var resultslice = results.getRange({start:searchid,end:searchid+1000});
            resultslice.forEach(function(slice) {
                searchResults.push(slice);
                searchid++;
                }
            );
        } while (resultslice.length >=1000);
        return searchResults;
    };
	
    return {
    	getFamily: getFamily,
    	getDirectTeam: getDirectTeam,
    	getAllTeam: getAllTeam
    };
    
});
