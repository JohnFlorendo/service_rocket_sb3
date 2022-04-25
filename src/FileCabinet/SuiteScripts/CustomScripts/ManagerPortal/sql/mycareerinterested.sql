SELECT BUILTIN.DF(mycareer.custrecord_myc_employee) AS rocketeer
	, BUILTIN.DF(employee.job) AS current_job
	, CONCAT(CONCAT(BUILTIN.DF(hcmjob.custrecord_sr_job_family), ' '),  jobfamily.altname) AS job_family
	, BUILTIN.DF(interested.maptwo) AS interested
	, BUILTIN.DF(employee.supervisor) AS manager
	, CONCAT(CONCAT(BUILTIN.DF(currentjob.custrecord_sr_job_family), ' '),  currentjobfamily.altname) AS current_job_family
FROM customrecord_mycareer mycareer
INNER JOIN employee
	ON mycareer.custrecord_myc_employee = employee.id
INNER JOIN map_customrecord_mycareer_custrecord_myc_iamiterested interested
	ON mycareer.id= interested.mapone
INNER JOIN hcmjob
	ON interested.maptwo  = hcmjob.id
INNER JOIN customrecord_sr_job_family AS jobfamily
	ON hcmjob.custrecord_sr_job_family = jobfamily.id
		AND jobfamily.isinactive = 'F'
INNER JOIN hcmjob currentjob
	ON employee.job = currentjob.id
INNER JOIN customrecord_sr_job_family currentjobfamily
	ON currentjob.custrecord_sr_job_family = currentjobfamily.id 
		AND currentjobfamily.isinactive = 'F'
WHERE employee.supervisor = ?
	OR employee.id > ?
ORDER BY jobfamily.name, BUILTIN.DF(interested.maptwo), BUILTIN.DF(mycareer.custrecord_myc_employee)