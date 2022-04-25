SELECT workcalendar.comments AS region
	, CASE WHEN workcalendar.comments = 'US' THEN '🇺🇸'
			WHEN workcalendar.comments = 'AU (SYD)' THEN '🇦🇺'
			WHEN workcalendar.comments = 'AU (VIC)' THEN '🇦🇺'
			WHEN workcalendar.comments = 'AU (QLD)' THEN '🇦🇺'
			WHEN workcalendar.comments = 'AU (SA)' THEN '🇦🇺'
			WHEN workcalendar.comments = 'MY' THEN '🇲🇾'
			WHEN workcalendar.comments = 'CL' THEN '🇨🇱'
			WHEN workcalendar.comments = 'IN' THEN '🇮🇳'
			WHEN workcalendar.comments = 'GB' THEN '🇬🇧'
			WHEN workcalendar.comments = 'SG' THEN '🇸🇬'
			WHEN workcalendar.comments = 'CA' THEN '🇨🇦'
			  ELSE ' ' END AS type
	, workcalendarholiday.description AS name
	, workcalendarholiday.exceptiondate AS date
	, CASE WHEN workcalendar.comments = 'US' THEN '0'
			WHEN workcalendar.comments = 'AU (SYD)' THEN '1'
			WHEN workcalendar.comments = 'AU (VIC)' THEN '2'
			WHEN workcalendar.comments = 'AU (QLD)' THEN '3'
			WHEN workcalendar.comments = 'AU (SA)' THEN '4'
			WHEN workcalendar.comments = 'MY' THEN '5'
			WHEN workcalendar.comments = 'CL' THEN '6'
			WHEN workcalendar.comments = 'IN' THEN '7'
			WHEN workcalendar.comments = 'GB' THEN '8'
			WHEN workcalendar.comments = 'SG' THEN '9'
			WHEN workcalendar.comments = 'CA' THEN '10'
	ELSE ' ' END AS axis

	, TO_CHAR(workcalendarholiday.exceptiondate, 'YYYY') AS yyyy
	, TO_CHAR(workcalendarholiday.exceptiondate, 'MM') AS mm
	, TO_CHAR(workcalendarholiday.exceptiondate, 'D') AS d1
	, TO_NUMBER(TO_CHAR(workcalendarholiday.exceptiondate, 'D')) +1 AS d2
FROM workcalendarholiday
INNER JOIN workcalendar
	ON workcalendarholiday.workcalendar = workcalendar.id
WHERE workcalendarholiday.exceptiondate BETWEEN BUILTIN.RELATIVE_RANGES('DFN0', 'START', 'DATE') 
	AND BUILTIN.RELATIVE_RANGES('DFN90', 'END', 'DATE')
ORDER BY workcalendarholiday.exceptiondate