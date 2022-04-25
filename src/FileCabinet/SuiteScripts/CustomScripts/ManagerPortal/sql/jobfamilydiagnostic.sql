SELECT	entityid as name
		, hcmjob.id AS jobid
		, hcmjob.title as title
		, customrecord_sr_job_family.id AS jobfamilyid
		, CONCAT(CONCAT(BUILTIN.DF(custrecord_sr_job_family), ' '),  customrecord_sr_job_family.altname) AS jobfamily
		, customrecord_sr_job_profile_level.custrecord_jpl_joblevel AS level,
		, compensationcurrency as currency
		, custentity_st_total_annual_compensation as totalcompen
FROM   	employee
		, hcmjob
		, customrecord_sr_job_profile_level
		, customrecord_sr_job_family
WHERE  	employee.job = hcmjob.id
		AND hcmjob.id = customrecord_sr_job_profile_level. custrecord_jpl_jobprofile
		AND hcmjob.custrecord_sr_job_family  = customrecord_sr_job_family.id
		AND employee.isinactive = 'F'
		AND employee.employeetype !=18