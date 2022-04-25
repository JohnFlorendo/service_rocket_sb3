SELECT TO_CHAR(timeoffrequestdetailsmachine.timeoffdate, 'YYYY.MM') AS month
	, SUM(timeoffrequestdetailsmachine.amountoftime) AS amount
FROM timeoffrequest
INNER JOIN employee
	ON timeoffrequest.employee = employee.id
INNER JOIN timeoffrequestdetailsmachine ON 
	timeoffrequest.id = timeoffrequestdetailsmachine.timeoffrequest
WHERE timeoffrequest.approvalstatus IN ('7') 
	AND timeoffrequestdetailsmachine.timeofftype IN ('1', '13')
	AND (timeoffrequest.employee = {{id}}
		OR ( timeoffrequest.employee = {{id}}
			AND employee.custentity_atlas_chr_hr_rep = {{hrmanager}})
		OR ( timeoffrequest.employee = {{id}}
			AND employee.supervisor= {{manager}}))
GROUP BY TO_CHAR(timeoffrequestdetailsmachine.timeoffdate, 'YYYY.MM')