SELECT * 
FROM
(SELECT custrecord_sn_record_id AS recordid
	, BUILTIN.DF(owner) AS author
	, custrecord_sn_message AS message
	, created AS date
	, BUILTIN.DF(custrecord_sn_note_category) AS priority
FROM customrecord_stick_note snote
INNER JOIN jobrequisition
	ON snote.custrecord_sn_record_id = jobrequisition.id
INNER JOIN map_customrecord_stick_note_custrecord_sn_allowed_entities msallowed
	ON snote.id = msallowed.mapone
WHERE (msallowed.maptwo = ? 
		OR msallowed.maptwo > ?)
	AND custrecord_sn_status != 'archived'

UNION

SELECT jobrequisition.id AS recordid
	, BUILTIN.DF(mycareer.custrecord_myc_employee) AS author
	, CONCAT(CONCAT('(',CONCAT(hcmjob.custrecord_sr_job_code,')')), ' - Interested.') AS message
	, mycareer.lastmodified AS date
	, 'High' AS priority
FROM jobrequisition
INNER JOIN map_customrecord_mycareer_custrecord_myc_iamiterested interested
	ON jobrequisition.jobid  = interested.maptwo
INNER JOIN customrecord_mycareer AS mycareer
	ON  interested.mapone = mycareer.id
INNER JOIN employee
	ON mycareer.custrecord_myc_employee = employee.id 
		AND employee.isinactive = 'F'
INNER JOIN hcmjob
	ON employee.job = hcmjob.id

UNION

SELECT jobrequisition.id AS jobrequisitionid
	, BUILTIN.DF(mycareer.custrecord_myc_employee) AS author 
	, CONCAT(CONCAT('(',CONCAT(hcmjob.custrecord_sr_job_code,')')), ' - Working to be one.') AS message
	, mycareer.lastmodified AS date
	, 'High' AS priority
FROM jobrequisition
INNER JOIN map_customrecord_mycareer_custrecord_myc_workingtobe working
	ON jobrequisition.jobid  = working.maptwo
INNER JOIN customrecord_mycareer AS mycareer
	ON  working.mapone = mycareer.id
INNER JOIN employee
	ON mycareer.custrecord_myc_employee = employee.id 
		AND employee.isinactive = 'F'
INNER JOIN hcmjob
	ON employee.job = hcmjob.id)

ORDER BY date DESC