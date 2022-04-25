SELECT goal.id AS id,
	, goal.name AS name
	, BUILTIN.DF(goal.employee) AS employee
	, NVL(goal.details, '') AS details
	, BUILTIN.DF(goal.goalstatus) AS status
	, TO_CHAR(goal.startdate, 'mm/dd/yyyy')  AS startdate
	, TO_CHAR(goal.targetdate, 'mm/dd/yyyy')  AS targetdate
 	, TO_CHAR(goal.closeddate, 'mm/dd/yyyy')  AS closeddate
	, BUILTIN.DF(goal.mood) AS mood
	, NVL(BUILTIN.DF(goal.areaoffocus) , 'TBA') AS areaoffocus
	, BUILTIN.DF(employee.class) AS class
	, BUILTIN.DF(employee.department) AS department
	, BUILTIN.DF(employee.location) AS location
	, BUILTIN.DF(employee.custentity4) AS lineofbusiness 
FROM goal
INNER JOIN employee
	ON goal.employee = employee.id
WHERE goal.id > 3
ORDER BY goal.id

