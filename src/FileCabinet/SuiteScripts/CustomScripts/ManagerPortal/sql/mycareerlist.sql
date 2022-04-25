SELECT CONCAT(CONCAT(BUILTIN.DF(workingtobejob.custrecord_sr_job_family), ' '),  jobfamily.altname) AS job_family
	, 'Working To Be One' AS status
	, BUILTIN.DF(working.maptwo) AS job
FROM customrecord_mycareer mycareer
INNER JOIN employee
	ON mycareer.custrecord_myc_employee = employee.id
INNER JOIN map_customrecord_mycareer_custrecord_myc_workingtobe working
	ON mycareer.id= working.mapone
INNER JOIN hcmjob workingtobejob
	ON working.maptwo  = workingtobejob.id
INNER JOIN customrecord_sr_job_family AS jobfamily
	ON workingtobejob.custrecord_sr_job_family = jobfamily.id 
		AND jobfamily.isinactive = 'F'
WHERE employee.id = ?

UNION

SELECT CONCAT(CONCAT(BUILTIN.DF(interestedjob.custrecord_sr_job_family), ' '),  jobfamily.altname) AS job_family
	, 'Interested' AS status
	, BUILTIN.DF(interested.maptwo) AS job
FROM customrecord_mycareer mycareer
INNER JOIN employee
	ON mycareer.custrecord_myc_employee = employee.id
INNER JOIN map_customrecord_mycareer_custrecord_myc_iamiterested interested
	ON mycareer.id= interested.mapone
INNER JOIN hcmjob interestedjob
	ON interested.maptwo  = interestedjob.id
INNER JOIN customrecord_sr_job_family AS jobfamily
	ON interestedjob.custrecord_sr_job_family = jobfamily.id
		AND jobfamily.isinactive = 'F'
WHERE employee.id = ?	