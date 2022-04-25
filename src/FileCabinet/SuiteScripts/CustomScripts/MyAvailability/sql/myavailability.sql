SELECT weeknum AS workcalendar_xcategory
	, (workcalendar - holiday) AS workcalendar
	, holiday
	, timeoff
	, allocation
	, CASE WHEN (workcalendar - holiday) - (allocation  + timeoff) > -1 THEN (workcalendar - holiday) - (allocation  + timeoff) ELSE 0 END unallocated
FROM (	SELECT  weeknum
			, SUM(CASE WHEN availability_type = 'workcalendar' THEN ABS(availability) ELSE 0 END) workcalendar
			, SUM(CASE WHEN availability_type = 'holiday' THEN ABS(availability) ELSE 0 END) holiday
			, SUM(CASE WHEN availability_type = 'timeoff' THEN ABS(availability) ELSE 0 END) timeoff
			, SUM(CASE WHEN availability_type = 'allocation' THEN ABS(availability) ELSE 0 END) allocation
		FROM ( 	SELECT weeknum
					, BUILTIN.DF(employee.id) AS rocketeer
					, CASE WHEN workcalendar.sunday = 'T' THEN workcalendar.workhoursperday  ELSE 0 END +
						CASE WHEN workcalendar.monday = 'T' THEN workcalendar.workhoursperday ELSE 0 END + 
						CASE WHEN workcalendar.tuesday = 'T' THEN workcalendar.workhoursperday ELSE 0 END +
						CASE WHEN workcalendar.wednesday = 'T' THEN workcalendar.workhoursperday ELSE 0 END +
						CASE WHEN workcalendar.thursday = 'T' THEN workcalendar.workhoursperday ELSE 0 END +
						CASE WHEN workcalendar.friday = 'T' THEN workcalendar.workhoursperday ELSE 0 END +
						CASE WHEN workcalendar.saturday = 'T' THEN workcalendar.workhoursperday ELSE 0 END AS availability
					, '1. Work Calendar Hours - ' || workcalendar.name AS description
					, 'workcalendar' AS availability_type
				FROM (	SELECT TO_CHAR(trunc(sysdate-21,'IW')+(rownum-1)*7,'YYYY.IW') AS weeknum
							, 0 AS availability
							, '' AS description
						FROM (SELECT rownum FROM dual) 
						CONNECT BY level <=30)
				CROSS JOIN employee, workcalendar 
				WHERE employee.workcalendar = workcalendar.id
					AND ( employee.id = {{id}}
					OR ( employee.id = {{id}}
						AND employee.custentity_atlas_chr_hr_rep = {{hrmanager}})
					OR ( employee.id = {{id}}
						AND employee.supervisor= {{manager}}))

				UNION ALL

				SELECT TO_CHAR(workcalendarholiday.exceptiondate,'YYYY.IW') AS weeknum
					, BUILTIN.DF(employee.id) AS rocketeer
					, -1 * workcalendar.workhoursperday AS availability
					, '2. Public Holiday - ' || workcalendarholiday.exceptiondate  || ' - ' ||  workcalendarholiday.description  AS description
					, 'holiday' AS availability_type
				FROM employee, workcalendar, workcalendarholiday
				WHERE employee.workcalendar = workcalendar.id
					AND workcalendar.id = workcalendarholiday.workcalendar
					AND employee.isinactive = 'F'
					AND workcalendarholiday.exceptiondate BETWEEN  BUILTIN.RELATIVE_RANGES( 'TRH', 'START' ) AND BUILTIN.RELATIVE_RANGES( 'TRH', 'END' ) 
					AND ( employee.id = {{id}}
					OR ( employee.id = {{id}}
						AND employee.custentity_atlas_chr_hr_rep = {{hrmanager}})
					OR ( employee.id = {{id}}
						AND employee.supervisor= {{manager}}))

				UNION ALL
				
				SELECT TO_CHAR(timeoffchange.dateapplied,'YYYY.IW') AS weeknum
					, BUILTIN.DF(timeoffchange.employee) AS rocketeer
					, timeoffchange.amount AS availability
					, '3. Time-off - ' || BUILTIN.DF(timeoffchange.timeofftype) || ' - ' || timeoffchange.timeoffrequest AS description
					, 'timeoff' AS availability_type
				FROM timeoffchange
				INNER JOIN employee
					ON timeoffchange.employee = employee.id
				WHERE timeoffchange.timeoffchangetype = 'USAGE'
					AND timeoffchange.dateapplied BETWEEN  BUILTIN.RELATIVE_RANGES( 'TRH', 'START' ) AND BUILTIN.RELATIVE_RANGES( 'TRH', 'END' )
					AND ( timeoffchange.employee = {{id}}
					OR ( timeoffchange.employee = {{id}}
						AND employee.custentity_atlas_chr_hr_rep = {{hrmanager}})
					OR ( timeoffchange.employee = {{id}}
						AND employee.supervisor= {{manager}}))
				
				UNION ALL

				SELECT TO_CHAR(timebill.trandate,'YYYY.IW') AS weeknum
					, BUILTIN.DF(timebill.employee) AS rocketeer
					, SUM(-1 * timebill.hours) AS availability
					, '4. ' || jobtype.name || ' - ' ||  BUILTIN.DF(	timebill.timetype) || ' - ' || BUILTIN.DF(	timebill.item) || ' - ' || BUILTIN.DF(timebill.customer) AS description
					, 'allocation' AS availability_type
				FROM timebill
				INNER JOIN employee
					ON timebill.employee = employee.id
				INNER JOIN job
					ON timebill.customer = job.id
				INNER JOIN jobtype
					ON  job.jobtype = jobtype.id
				WHERE timebill.timetype <> 'A'
					AND  timebill.trandate BETWEEN  BUILTIN.RELATIVE_RANGES( 'TRH', 'START' ) AND BUILTIN.RELATIVE_RANGES( 'TRH', 'END' ) 
					AND ( timebill.employee = {{id}}
					OR ( timebill.employee = {{id}}
						AND employee.custentity_atlas_chr_hr_rep = {{hrmanager}})
					OR ( timebill.employee = {{id}}
						AND employee.supervisor= {{manager}}))
				GROUP BY TO_CHAR(timebill.trandate,'YYYY.IW') 
					, BUILTIN.DF(timebill.employee) 
					, '4. ' || jobtype.name || ' - ' || BUILTIN.DF(	timebill.timetype) || ' - ' || BUILTIN.DF(	timebill.item) || ' - ' || BUILTIN.DF(timebill.customer)
		)

		WHERE weeknum >= TO_CHAR(sysdate,'YYYY.IW')
		GROUP BY weeknum
		ORDER BY weeknum
	)
WHERE rownum <=12
ORDER BY weeknum