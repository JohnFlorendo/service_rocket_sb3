SELECT goal.id || ' - ' || goal.name || '+/app/hcm/perfmgmt/goal.nl?id=' || goal.id AS goal_name_link
	, focus.description AS area_of_focus
	, goal.startdate AS start_date
	, goal.closeddate AS closed_date
	, goal.targetdate AS target_date
	, goal.lastmodifieddate AS last_modified_date
	, BUILTIN.DF(goal.goalstatus) AS goal_status
	, BUILTIN.DF(goal.mood) AS goal_mood
	, CASE WHEN goal.approved = 'T' THEN '✔️'
	END AS approved
	, CASE WHEN (( 7 + TRUNC( comments.custrecord_gc_date + 1, 'IW' ) - TRUNC( TRUNC( comments.custrecord_gc_date, 'Q' ) + 1, 'IW' ) ) / 7 = 1 ) 
	     THEN CASE WHEN comments.custrecord_gc_employee = employee.id THEN '⚫️'
			WHEN comments.custrecord_gc_employee = employee.supervisor THEN '⬛️'
			WHEN (comments.custrecord_gc_employee <> employee.supervisor AND comments.custrecord_gc_employee <> employee.id ) THEN '⬛️' 
		END
	END AS review_q#w01
	, CASE WHEN (( 7 + TRUNC( comments.custrecord_gc_date + 1, 'IW' ) - TRUNC( TRUNC( comments.custrecord_gc_date, 'Q' ) + 1, 'IW' ) ) / 7 = 2 ) 
		THEN CASE WHEN comments.custrecord_gc_employee = employee.id THEN '⚫️'
			WHEN comments.custrecord_gc_employee = employee.supervisor THEN '⬛️'
			WHEN (comments.custrecord_gc_employee <> employee.supervisor AND comments.custrecord_gc_employee <> employee.id ) THEN '⬛️' 
		END 
	
	END AS review_q#w02
	, CASE WHEN (( 7 + TRUNC( comments.custrecord_gc_date + 1, 'IW' ) - TRUNC( TRUNC( comments.custrecord_gc_date, 'Q' ) + 1, 'IW' ) ) / 7 = 3 ) 
	     THEN CASE WHEN comments.custrecord_gc_employee = employee.id THEN '⚫️'
			WHEN comments.custrecord_gc_employee = employee.supervisor THEN '⬛️'
			WHEN (comments.custrecord_gc_employee <> employee.supervisor AND comments.custrecord_gc_employee <> employee.id ) THEN '⬛️' 
		END
	END AS review_q#w03,
	CASE WHEN (( 7 + TRUNC( comments.custrecord_gc_date + 1, 'IW' ) - TRUNC( TRUNC( comments.custrecord_gc_date, 'Q' ) + 1, 'IW' ) ) / 7 = 4 ) 
		THEN CASE WHEN comments.custrecord_gc_employee = employee.id THEN '⚫️'
			WHEN comments.custrecord_gc_employee = employee.supervisor THEN '⬛️'
			WHEN (comments.custrecord_gc_employee <> employee.supervisor AND comments.custrecord_gc_employee <> employee.id ) THEN '⬛️' 
		END
	END AS review_q#w04,
	CASE WHEN (( 7 + TRUNC( comments.custrecord_gc_date + 1, 'IW' ) - TRUNC( TRUNC( comments.custrecord_gc_date, 'Q' ) + 1, 'IW' ) ) / 7 = 5 ) 
		THEN CASE WHEN comments.custrecord_gc_employee = employee.id THEN '⚫️'
			WHEN comments.custrecord_gc_employee = employee.supervisor THEN '⬛️'
			WHEN (comments.custrecord_gc_employee <> employee.supervisor AND comments.custrecord_gc_employee <> employee.id ) THEN '⬛️' 
		END
	END AS review_q#w05,
	CASE WHEN (( 7 + TRUNC( comments.custrecord_gc_date + 1, 'IW' ) - TRUNC( TRUNC( comments.custrecord_gc_date, 'Q' ) + 1, 'IW' ) ) / 7 = 6 ) 
		THEN CASE WHEN comments.custrecord_gc_employee = employee.id THEN '⚫️'
			WHEN comments.custrecord_gc_employee = employee.supervisor THEN '⬛️'
			WHEN (comments.custrecord_gc_employee <> employee.supervisor AND comments.custrecord_gc_employee <> employee.id ) THEN '⬛️' 
		END
	END AS review_q#w06,
	CASE WHEN (( 7 + TRUNC( comments.custrecord_gc_date + 1, 'IW' ) - TRUNC( TRUNC( comments.custrecord_gc_date, 'Q' ) + 1, 'IW' ) ) / 7 = 7 ) 
		THEN CASE WHEN comments.custrecord_gc_employee = employee.id THEN '⚫️'
			WHEN comments.custrecord_gc_employee = employee.supervisor THEN '⬛️'
			WHEN (comments.custrecord_gc_employee <> employee.supervisor AND comments.custrecord_gc_employee <> employee.id ) THEN '⬛️' 
		END
	END AS review_q#w07,
	CASE WHEN (( 7 + TRUNC( comments.custrecord_gc_date + 1, 'IW' ) - TRUNC( TRUNC( comments.custrecord_gc_date, 'Q' ) + 1, 'IW' ) ) / 7 = 8 ) 
		THEN CASE WHEN comments.custrecord_gc_employee = employee.id THEN '⚫️'
			WHEN comments.custrecord_gc_employee = employee.supervisor THEN '⬛️'
			WHEN (comments.custrecord_gc_employee <> employee.supervisor AND comments.custrecord_gc_employee <> employee.id ) THEN '⬛️' 
		END
	END AS review_q#w08,
	CASE WHEN (( 7 + TRUNC( comments.custrecord_gc_date + 1, 'IW' ) - TRUNC( TRUNC( comments.custrecord_gc_date, 'Q' ) + 1, 'IW' ) ) / 7 = 9 ) 
		THEN CASE WHEN comments.custrecord_gc_employee = employee.id THEN '⚫️'
			WHEN comments.custrecord_gc_employee = employee.supervisor THEN '⬛️'
			WHEN (comments.custrecord_gc_employee <> employee.supervisor AND comments.custrecord_gc_employee <> employee.id ) THEN '⬛️' 
		END
	END AS review_q#w09,
	CASE WHEN (( 7 + TRUNC( comments.custrecord_gc_date + 1, 'IW' ) - TRUNC( TRUNC( comments.custrecord_gc_date, 'Q' ) + 1, 'IW' ) ) / 7 = 10 ) 
		THEN CASE WHEN comments.custrecord_gc_employee = employee.id THEN '⚫️'
			WHEN comments.custrecord_gc_employee = employee.supervisor THEN '⬛️'
			WHEN (comments.custrecord_gc_employee <> employee.supervisor AND comments.custrecord_gc_employee <> employee.id ) THEN '⬛️' 
		END
	END AS review_q#w10,
	CASE WHEN (( 7 + TRUNC( comments.custrecord_gc_date + 1, 'IW' ) - TRUNC( TRUNC( comments.custrecord_gc_date, 'Q' ) + 1, 'IW' ) ) / 7 = 11) 
		THEN CASE WHEN comments.custrecord_gc_employee = employee.id THEN '⚫️'
			WHEN comments.custrecord_gc_employee = employee.supervisor THEN '⬛️'
			WHEN (comments.custrecord_gc_employee <> employee.supervisor AND comments.custrecord_gc_employee <> employee.id ) THEN '⬛️' 
		END
	END AS review_q#w11,
	CASE WHEN (( 7 + TRUNC( comments.custrecord_gc_date + 1, 'IW' ) - TRUNC( TRUNC( comments.custrecord_gc_date, 'Q' ) + 1, 'IW' ) ) / 7 = 12 ) 
		THEN CASE WHEN comments.custrecord_gc_employee = employee.id THEN '⚫️'
			WHEN comments.custrecord_gc_employee = employee.supervisor THEN '⬛️'
			WHEN (comments.custrecord_gc_employee <> employee.supervisor AND comments.custrecord_gc_employee <> employee.id ) THEN '⬛️' 
		END
	END AS review_q#w12,
	CASE WHEN (( 7 + TRUNC( comments.custrecord_gc_date + 1, 'IW' ) - TRUNC( TRUNC( comments.custrecord_gc_date, 'Q' ) + 1, 'IW' ) ) / 7 = 13 ) 
		THEN CASE WHEN comments.custrecord_gc_employee = employee.id THEN '⚫️'
			WHEN comments.custrecord_gc_employee = employee.supervisor THEN '⬛️'
			WHEN (comments.custrecord_gc_employee <> employee.supervisor AND comments.custrecord_gc_employee <> employee.id ) THEN '⬛️' 
		END
	END AS review_q#w13,
	CASE WHEN (( 7 + TRUNC( comments.custrecord_gc_date + 1, 'IW' ) - TRUNC( TRUNC( comments.custrecord_gc_date, 'Q' ) + 1, 'IW' ) ) / 7 = 14 ) 
		THEN CASE WHEN comments.custrecord_gc_employee = employee.id THEN '⚫️'
			WHEN comments.custrecord_gc_employee = employee.supervisor THEN '⬛️'
			WHEN (comments.custrecord_gc_employee <> employee.supervisor AND comments.custrecord_gc_employee <> employee.id ) THEN '⬛️' 
		END
	END AS review_q#w14
	, CASE WHEN (goal.closeddate is null  AND TO_NUMBER(TO_CHAR(goal.targetdate, 'MM')) >= 7) THEN  'FY' || (TO_NUMBER(TO_CHAR(goal.targetdate, 'yy')) + 1)
	 WHEN (goal.closeddate is not null  AND TO_NUMBER(TO_CHAR(goal.closeddate, 'MM')) >= 7) THEN  'FY' || (TO_NUMBER(TO_CHAR(goal.closeddate, 'yy')) + 1)
	 WHEN (goal.closeddate is null  AND TO_NUMBER(TO_CHAR(goal.targetdate, 'MM')) < 7) THEN  'FY' || TO_NUMBER(TO_CHAR(goal.targetdate, 'yy')) 
	 WHEN (goal.closeddate is not null  AND TO_NUMBER(TO_CHAR(goal.closeddate, 'MM')) < 7) THEN  'FY' || TO_NUMBER(TO_CHAR(goal.closeddate, 'yy')) 
	END AS fygoalperiod_hide
	, CASE 
	     WHEN goal.closeddate is null AND TO_CHAR(goal.targetdate, 'Q') = 1 THEN 'Q3'
	     WHEN goal.closeddate is null AND TO_CHAR(goal.targetdate, 'Q') = 2 THEN 'Q4'
    	 WHEN goal.closeddate is null AND TO_CHAR(goal.targetdate, 'Q') = 3 THEN 'Q1'
	     WHEN goal.closeddate is null AND TO_CHAR(goal.targetdate, 'Q') = 4 THEN 'Q2'
	     WHEN goal.closeddate is not null AND TO_CHAR(goal.closeddate, 'Q') = 1 THEN 'Q3'
	     WHEN goal.closeddate is not null AND TO_CHAR(goal.closeddate, 'Q') = 2 THEN 'Q4'
    	 WHEN goal.closeddate is not null AND TO_CHAR(goal.closeddate, 'Q') = 3 THEN 'Q1'
	     WHEN goal.closeddate is not null AND TO_CHAR(goal.closeddate, 'Q') = 4 THEN 'Q2'
	END AS fqgoalperiod_hide
	, stf.custrecord_sr_stf_audit_points AS stf_points
	, BUILTIN.DF(stf.custrecord_sr_stf_audit_cycle) AS audit_cycle
	, BUILTIN.DF(stf.custrecord_sr_stf_audit_status) || '+/app/common/custom/custrecordentry.nl?rectype=1430&id=' || stf.id AS audit_status_link
	, stf.custrecord_sr_goal_audit_comments AS audit_comments

FROM employee
LEFT OUTER JOIN goal
	ON (employee.id = goal.employee
			AND goal.isinactive = 'F'
			AND goal.goalstatus <> 5 )
LEFT OUTER JOIN customrecord_goalcomments comments
	ON (goal.id = comments.custrecord_gc_goal )
LEFT OUTER JOIN areaoffocus focus
	ON (goal.areaoffocus = focus.id )
LEFT OUTER JOIN goalevaluation rocketeereval
	ON (goal.id = rocketeereval.goal
			AND rocketeereval.createdby = employee.id )
LEFT OUTER JOIN goalevaluation managereval
	ON (goal.id = managereval.goal
        AND managereval.createdby <> employee.id )
LEFT OUTER JOIN customrecord_sr_goal_stf_audit stf ON
	(goal.id = stf.custrecord_sr_stf_audit_goal)

WHERE employee.id = ?
	AND goal.targetdate BETWEEN BUILTIN.RELATIVE_RANGES('paramquarter', 'START', 'DATE') 
				AND BUILTIN.RELATIVE_RANGES('paramquarter', 'END', 'DATE')
	
ORDER  BY goal.id ASC