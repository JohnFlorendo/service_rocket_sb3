SELECT TO_CHAR(timeoffchange.dateapplied, 'YYYY.MM') AS month 
	, BUILTIN.DF(timeoffchange.employee) AS employee
	, SUM(CASE BUILTIN.DF(timeoffchange.timeoffchangetype) 
		WHEN 'Usage' THEN ABS(timeoffchange.amount) 
		ELSE 0.00 END) AS usage
	, SUM(CASE BUILTIN.DF(timeoffchange.timeoffchangetype) 
		WHEN 'Manual Increase' THEN timeoffchange.amount 
		WHEN 'Accrual' THEN timeoffchange.amount 
		ELSE 0.00 END) AS accrual
	, SUM(timeoffchange.amount) AS total 
	, SUM(0) AS pto
FROM timeoffchange
INNER JOIN employee
	ON timeoffchange.employee = employee.id
LEFT JOIN timeofftype 
	ON timeoffchange.timeofftype = timeofftype.id
WHERE ((NOT(timeoffchange.timeoffchangetype IN ('CARRYOVER', 'YEAR_END_EXPIRY')) 
			OR timeoffchange.timeoffchangetype IS NULL) 
		AND timeofftype.id IN (1, 13, 14))
	AND ( timeoffchange.employee = {{id}}
		OR ( timeoffchange.employee = {{id}}
			AND employee.custentity_atlas_chr_hr_rep = {{hrmanager}})
		OR ( timeoffchange.employee = {{id}}
			AND employee.supervisor= {{manager}}))
GROUP BY TO_CHAR(timeoffchange.dateapplied, 'YYYY.MM'), BUILTIN.DF(timeoffchange.employee) 
ORDER BY  TO_CHAR(timeoffchange.dateapplied, 'YYYY.MM') ASC NULLS LAST