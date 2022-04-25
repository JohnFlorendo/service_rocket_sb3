SELECT jobrequisition.title AS jobtitle
	, hcmjob.custrecord_sr_job_code AS jobcode
	, BUILTIN.DF(jobrequisition.requisitionstatus) AS status
	, jobrequisition.custrecord_jr_workforce_planning_status AS workforcestatus
	, BUILTIN.DF(jobrequisition.custrecord_jr_worktype) AS worktype
	, jobrequisition.opendate AS opendate
	, jobrequisition.targethiredate AS targetdate
	, jobrequisition.custrecord_sr_expected_start_date AS expectedstart
	, jobrequisition.closedate AS closedate
	, BUILTIN.DF(jobrequisition.subsidiary) AS subsidiary
	, BUILTIN.DF(jobrequisition.location) AS location
	, BUILTIN.DF(jobrequisition.class) AS class
	, BUILTIN.DF(jobrequisition.custrecord_sr_req_hr_manager) AS hrmanager
	, BUILTIN.DF(jobrequisition.approvedby) AS approvedby
	, BUILTIN.DF(jobrequisition.hiringmanager)AS hiringmanager
	, BUILTIN.DF(jobrequisition.recruiter) AS recruiter
	, jobrequisition.custrecord_jr_leverid AS leverid
FROM jobrequisition
INNER JOIN hcmjob
	ON jobrequisition.jobid = hcmjob.id
WHERE jobrequisition.custrecord_sr_req_hr_manager = ?