SELECT timeofftype.displayname AS timeofftype
	, SUM(CASE WHEN timeoffchangetype = 'ACCRUAL' THEN ROUND(amount  / workcalendar.workhoursperday,2)
			WHEN timeoffchangetype = 'CARRYOVER' THEN ROUND(amount / workcalendar.workhoursperday,2)
			ELSE 0  END) AS availablethisyear
	, SUM(CASE WHEN timeoffchangetype = 'USAGE' 
			AND dateapplied  BETWEEN BUILTIN.RELATIVE_RANGES('TY', 'START', 'DATE') 
			AND BUILTIN.RELATIVE_RANGES('TODAY', 'END', 'DATE') 
				THEN ROUND(ABS(amount) / workcalendar.workhoursperday, 2)
			ELSE 0  END) AS used
	, SUM(CASE WHEN timeoffchangetype = 'USAGE' 
			AND dateapplied  BETWEEN BUILTIN.RELATIVE_RANGES('TOMORROW', 'START', 'DATE') 
			AND BUILTIN.RELATIVE_RANGES('TY', 'END', 'DATE') 
				THEN ROUND(ABS(amount) / workcalendar.workhoursperday, 2)
			ELSE 0  END) AS planned
	, SUM(CASE WHEN timeoffchangetype = 'YEAR_END_EXPIRY' 
				THEN ROUND(ABS(amount) / workcalendar.workhoursperday, 2)
			ELSE 0  END) AS availablenow
FROM timeoffchange
INNER JOIN timeofftype
	ON timeoffchange.timeofftype = timeofftype.id
INNER JOIN employee
	ON timeoffchange.employee =  employee.id
INNER JOIN workcalendar
	ON  employee.workcalendar = workcalendar.id
WHERE timeoffchange.employee = {{id}}
AND dateapplied  BETWEEN BUILTIN.RELATIVE_RANGES('TY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('TY', 'END', 'DATE')
GROUP BY  timeofftype.displayname 

{{}}
SELECT timeofftype.displayname AS timeofftype
	, SUM(amount) AS hours
FROM timeoffchange
INNER JOIN timeofftype
	ON timeoffchange.timeofftype = timeofftype.id
WHERE employee = {{id}}
	
GROUP BY BUILTIN.DF(timeofftype.displayname)
ORDER BY timeofftype.displayname

{{}}

SELECT timeofftype.displayname AS timeofftype
	, SUM(amount) AS hours
FROM timeoffchange
INNER JOIN timeofftype
	ON timeoffchange.timeofftype = timeofftype.id
WHERE employee = 171596
	AND dateappplied <= BUILTIN.RELATIVE_RANGES('TODAY', 'END', 'DATE')
	AND dateappplied => BUILTIN.RELATIVE_RANGES('TODAY', 'END', 'DATE')
GROUP BY BUILTIN.DF(timeofftype.displayname)
ORDER BY timeofftype.displayname

SELECT timeofftype.displayname AS timeofftype
	, SUM(CASE WHEN timeoffchangetype = 'ACCRUAL' THEN amount 
			WHEN timeoffchangetype = 'CARRYOVER' THEN amount 
			ELSE 0  END) AS availablethisyear
	, SUM(CASE WHEN timeoffchangetype = 'YEAR_END_EXPIRY' THEN ABS(amount)
			ELSE 0  END) AS availablenow
FROM timeoffchange
INNER JOIN timeofftype
	ON timeoffchange.timeofftype = timeofftype.id
WHERE employee = 452
AND dateapplied  BETWEEN BUILTIN.RELATIVE_RANGES('TY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('TY', 'END', 'DATE')
GROUP BY  timeofftype.displayname


