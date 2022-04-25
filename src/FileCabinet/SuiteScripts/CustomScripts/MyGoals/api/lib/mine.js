define(['../../../SuiteTable/api/suitetable'],
/**
 * @param {suitetable} suitetable
 */
function(suitetable) {
	   
	get = function(option){
		
		var arrMyGoals = suitetable.getData({
			sqlfile: 'SuiteScripts/CustomScripts/MyGoals/sql/mygoals.sql',
			params : option.params,
			custparam: option.custparam
		});
		
		try{
			
			arrMyGoals.tabname = arrMyGoals.data[0][23] + '-' + arrMyGoals.data[0][24];
			
			var sQx = JSON.stringify(arrMyGoals.header);
			sQx = sQx.replace(/Q#/gi, arrMyGoals.data[0][24]);
			arrMyGoals.header = JSON.parse(sQx);
			
		}
		catch(err){
			
		}
		
		try{
			
			var arrDups = arrMyGoals.data.map(function(goal){ return goal[0]});
			
			
			for (var idx = arrDups.length - 1; idx >= 0; idx--) {

				var goal = arrDups[idx];
				
				if(arrDups.indexOf(goal) != idx){
					
					arrMyGoals.data[arrDups.indexOf(goal)][9] = arrMyGoals.data[arrDups.indexOf(goal)][9] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][9];
					arrMyGoals.data[arrDups.indexOf(goal)][10] = arrMyGoals.data[arrDups.indexOf(goal)][10] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][10];
					arrMyGoals.data[arrDups.indexOf(goal)][11] = arrMyGoals.data[arrDups.indexOf(goal)][11] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][11];
					arrMyGoals.data[arrDups.indexOf(goal)][12] = arrMyGoals.data[arrDups.indexOf(goal)][12] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][12];
					arrMyGoals.data[arrDups.indexOf(goal)][13] = arrMyGoals.data[arrDups.indexOf(goal)][13] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][13];
					arrMyGoals.data[arrDups.indexOf(goal)][14] = arrMyGoals.data[arrDups.indexOf(goal)][14] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][14];
					arrMyGoals.data[arrDups.indexOf(goal)][15] = arrMyGoals.data[arrDups.indexOf(goal)][15] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][15];
					arrMyGoals.data[arrDups.indexOf(goal)][16] = arrMyGoals.data[arrDups.indexOf(goal)][16] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][16];
					arrMyGoals.data[arrDups.indexOf(goal)][17] = arrMyGoals.data[arrDups.indexOf(goal)][17] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][17];
					arrMyGoals.data[arrDups.indexOf(goal)][18] = arrMyGoals.data[arrDups.indexOf(goal)][18] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][18];
					arrMyGoals.data[arrDups.indexOf(goal)][19] = arrMyGoals.data[arrDups.indexOf(goal)][19] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][19];
					arrMyGoals.data[arrDups.indexOf(goal)][20] = arrMyGoals.data[arrDups.indexOf(goal)][20] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][20];
					arrMyGoals.data[arrDups.indexOf(goal)][21] = arrMyGoals.data[arrDups.indexOf(goal)][21] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][21];
					arrMyGoals.data[arrDups.indexOf(goal)][22] = arrMyGoals.data[arrDups.indexOf(goal)][22] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][22];
					
					arrMyGoals.data[arrDups.indexOf(goal)][9] = ((arrMyGoals.data[arrDups.indexOf(goal)][9]).indexOf(arrMyGoals.data[idx][9])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][9] || arrMyGoals.data[arrDups.indexOf(goal)][9] + arrMyGoals.data[idx][9];
					arrMyGoals.data[arrDups.indexOf(goal)][10] = ((arrMyGoals.data[arrDups.indexOf(goal)][10]).indexOf(arrMyGoals.data[idx][10])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][10] || arrMyGoals.data[arrDups.indexOf(goal)][10] + arrMyGoals.data[idx][10];
					arrMyGoals.data[arrDups.indexOf(goal)][11] = ((arrMyGoals.data[arrDups.indexOf(goal)][11]).indexOf(arrMyGoals.data[idx][11])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][11] || arrMyGoals.data[arrDups.indexOf(goal)][11] + arrMyGoals.data[idx][11];
					arrMyGoals.data[arrDups.indexOf(goal)][12] = ((arrMyGoals.data[arrDups.indexOf(goal)][12]).indexOf(arrMyGoals.data[idx][12])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][12] || arrMyGoals.data[arrDups.indexOf(goal)][12] + arrMyGoals.data[idx][12];
					arrMyGoals.data[arrDups.indexOf(goal)][13] = ((arrMyGoals.data[arrDups.indexOf(goal)][13]).indexOf(arrMyGoals.data[idx][13])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][13] || arrMyGoals.data[arrDups.indexOf(goal)][13] + arrMyGoals.data[idx][13];
					arrMyGoals.data[arrDups.indexOf(goal)][14] = ((arrMyGoals.data[arrDups.indexOf(goal)][14]).indexOf(arrMyGoals.data[idx][14])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][14] || arrMyGoals.data[arrDups.indexOf(goal)][14] + arrMyGoals.data[idx][14];
					arrMyGoals.data[arrDups.indexOf(goal)][15] = ((arrMyGoals.data[arrDups.indexOf(goal)][15]).indexOf(arrMyGoals.data[idx][15])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][15] || arrMyGoals.data[arrDups.indexOf(goal)][15] + arrMyGoals.data[idx][15];
					arrMyGoals.data[arrDups.indexOf(goal)][16] = ((arrMyGoals.data[arrDups.indexOf(goal)][16]).indexOf(arrMyGoals.data[idx][16])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][16] || arrMyGoals.data[arrDups.indexOf(goal)][16] + arrMyGoals.data[idx][16];
					arrMyGoals.data[arrDups.indexOf(goal)][17] = ((arrMyGoals.data[arrDups.indexOf(goal)][17]).indexOf(arrMyGoals.data[idx][17])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][17] || arrMyGoals.data[arrDups.indexOf(goal)][17] + arrMyGoals.data[idx][17];
					arrMyGoals.data[arrDups.indexOf(goal)][18] = ((arrMyGoals.data[arrDups.indexOf(goal)][18]).indexOf(arrMyGoals.data[idx][18])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][18] || arrMyGoals.data[arrDups.indexOf(goal)][18] + arrMyGoals.data[idx][18];
					arrMyGoals.data[arrDups.indexOf(goal)][19] = ((arrMyGoals.data[arrDups.indexOf(goal)][19]).indexOf(arrMyGoals.data[idx][19])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][19] || arrMyGoals.data[arrDups.indexOf(goal)][19] + arrMyGoals.data[idx][19];
					arrMyGoals.data[arrDups.indexOf(goal)][20] = ((arrMyGoals.data[arrDups.indexOf(goal)][20]).indexOf(arrMyGoals.data[idx][20])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][20] || arrMyGoals.data[arrDups.indexOf(goal)][20] + arrMyGoals.data[idx][20];
					arrMyGoals.data[arrDups.indexOf(goal)][21] = ((arrMyGoals.data[arrDups.indexOf(goal)][21]).indexOf(arrMyGoals.data[idx][21])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][21] || arrMyGoals.data[arrDups.indexOf(goal)][21] + arrMyGoals.data[idx][21];
					arrMyGoals.data[arrDups.indexOf(goal)][22] = ((arrMyGoals.data[arrDups.indexOf(goal)][21]).indexOf(arrMyGoals.data[idx][22])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][22] || arrMyGoals.data[arrDups.indexOf(goal)][22] + arrMyGoals.data[idx][22];
					arrMyGoals.data.splice(idx,1);
				}
				
			}
			
			
//			var isDuplicate = arrDups.some(function(goal, idx){
//				
//				if(arrDups.indexOf(goal) != idx){
//					
//					arrMyGoals.data[arrDups.indexOf(goal)][9] = arrMyGoals.data[arrDups.indexOf(goal)][9] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][9];
//					arrMyGoals.data[arrDups.indexOf(goal)][10] = arrMyGoals.data[arrDups.indexOf(goal)][10] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][10];
//					arrMyGoals.data[arrDups.indexOf(goal)][11] = arrMyGoals.data[arrDups.indexOf(goal)][11] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][11];
//					arrMyGoals.data[arrDups.indexOf(goal)][12] = arrMyGoals.data[arrDups.indexOf(goal)][12] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][12];
//					arrMyGoals.data[arrDups.indexOf(goal)][13] = arrMyGoals.data[arrDups.indexOf(goal)][13] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][13];
//					arrMyGoals.data[arrDups.indexOf(goal)][14] = arrMyGoals.data[arrDups.indexOf(goal)][14] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][14];
//					arrMyGoals.data[arrDups.indexOf(goal)][15] = arrMyGoals.data[arrDups.indexOf(goal)][15] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][15];
//					arrMyGoals.data[arrDups.indexOf(goal)][16] = arrMyGoals.data[arrDups.indexOf(goal)][16] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][16];
//					arrMyGoals.data[arrDups.indexOf(goal)][17] = arrMyGoals.data[arrDups.indexOf(goal)][17] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][17];
//					arrMyGoals.data[arrDups.indexOf(goal)][18] = arrMyGoals.data[arrDups.indexOf(goal)][18] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][18];
//					arrMyGoals.data[arrDups.indexOf(goal)][19] = arrMyGoals.data[arrDups.indexOf(goal)][19] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][19];
//					arrMyGoals.data[arrDups.indexOf(goal)][20] = arrMyGoals.data[arrDups.indexOf(goal)][20] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][20];
//					arrMyGoals.data[arrDups.indexOf(goal)][21] = arrMyGoals.data[arrDups.indexOf(goal)][21] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][21];
//					arrMyGoals.data[arrDups.indexOf(goal)][22] = arrMyGoals.data[arrDups.indexOf(goal)][22] === null ? '': arrMyGoals.data[arrDups.indexOf(goal)][22];
//					
//					arrMyGoals.data[arrDups.indexOf(goal)][9] = ((arrMyGoals.data[arrDups.indexOf(goal)][9]).indexOf(arrMyGoals.data[idx][9])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][9] || arrMyGoals.data[arrDups.indexOf(goal)][9] + arrMyGoals.data[idx][9];
//					arrMyGoals.data[arrDups.indexOf(goal)][10] = ((arrMyGoals.data[arrDups.indexOf(goal)][10]).indexOf(arrMyGoals.data[idx][10])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][10] || arrMyGoals.data[arrDups.indexOf(goal)][10] + arrMyGoals.data[idx][10];
//					arrMyGoals.data[arrDups.indexOf(goal)][11] = ((arrMyGoals.data[arrDups.indexOf(goal)][11]).indexOf(arrMyGoals.data[idx][11])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][11] || arrMyGoals.data[arrDups.indexOf(goal)][11] + arrMyGoals.data[idx][11];
//					arrMyGoals.data[arrDups.indexOf(goal)][12] = ((arrMyGoals.data[arrDups.indexOf(goal)][12]).indexOf(arrMyGoals.data[idx][12])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][12] || arrMyGoals.data[arrDups.indexOf(goal)][12] + arrMyGoals.data[idx][12];
//					arrMyGoals.data[arrDups.indexOf(goal)][13] = ((arrMyGoals.data[arrDups.indexOf(goal)][13]).indexOf(arrMyGoals.data[idx][13])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][13] || arrMyGoals.data[arrDups.indexOf(goal)][13] + arrMyGoals.data[idx][13];
//					arrMyGoals.data[arrDups.indexOf(goal)][14] = ((arrMyGoals.data[arrDups.indexOf(goal)][14]).indexOf(arrMyGoals.data[idx][14])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][14] || arrMyGoals.data[arrDups.indexOf(goal)][14] + arrMyGoals.data[idx][14];
//					arrMyGoals.data[arrDups.indexOf(goal)][15] = ((arrMyGoals.data[arrDups.indexOf(goal)][15]).indexOf(arrMyGoals.data[idx][15])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][15] || arrMyGoals.data[arrDups.indexOf(goal)][15] + arrMyGoals.data[idx][15];
//					arrMyGoals.data[arrDups.indexOf(goal)][16] = ((arrMyGoals.data[arrDups.indexOf(goal)][16]).indexOf(arrMyGoals.data[idx][16])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][16] || arrMyGoals.data[arrDups.indexOf(goal)][16] + arrMyGoals.data[idx][16];
//					arrMyGoals.data[arrDups.indexOf(goal)][17] = ((arrMyGoals.data[arrDups.indexOf(goal)][17]).indexOf(arrMyGoals.data[idx][17])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][17] || arrMyGoals.data[arrDups.indexOf(goal)][17] + arrMyGoals.data[idx][17];
//					arrMyGoals.data[arrDups.indexOf(goal)][18] = ((arrMyGoals.data[arrDups.indexOf(goal)][18]).indexOf(arrMyGoals.data[idx][18])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][18] || arrMyGoals.data[arrDups.indexOf(goal)][18] + arrMyGoals.data[idx][18];
//					arrMyGoals.data[arrDups.indexOf(goal)][19] = ((arrMyGoals.data[arrDups.indexOf(goal)][19]).indexOf(arrMyGoals.data[idx][19])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][19] || arrMyGoals.data[arrDups.indexOf(goal)][19] + arrMyGoals.data[idx][19];
//					arrMyGoals.data[arrDups.indexOf(goal)][20] = ((arrMyGoals.data[arrDups.indexOf(goal)][20]).indexOf(arrMyGoals.data[idx][20])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][20] || arrMyGoals.data[arrDups.indexOf(goal)][20] + arrMyGoals.data[idx][20];
//					arrMyGoals.data[arrDups.indexOf(goal)][21] = ((arrMyGoals.data[arrDups.indexOf(goal)][21]).indexOf(arrMyGoals.data[idx][21])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][21] || arrMyGoals.data[arrDups.indexOf(goal)][21] + arrMyGoals.data[idx][21];
//					arrMyGoals.data[arrDups.indexOf(goal)][22] = ((arrMyGoals.data[arrDups.indexOf(goal)][21]).indexOf(arrMyGoals.data[idx][22])) > -1 && arrMyGoals.data[arrDups.indexOf(goal)][22] || arrMyGoals.data[arrDups.indexOf(goal)][22] + arrMyGoals.data[idx][22];
//					arrMyGoals.data.splice(idx,1);
//				}
//				
//			    return false;
//			});
			
			
			
			var x =1;
		
		}
		catch(err){
			
		}
		
		
		return arrMyGoals;
	};
	
    return {
        get:get
    };
    
});
