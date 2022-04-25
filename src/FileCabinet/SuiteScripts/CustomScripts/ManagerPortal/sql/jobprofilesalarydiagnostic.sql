SELECT	entityid as name
		, hcmjob.id AS jobid
		, CONCAT(CONCAT(CONCAT(hcmjob.title, ' ('), hcmjob.id), ')') as title
		, customrecord_sr_job_family.id AS jobfamilyid
		, CONCAT(CONCAT(BUILTIN.DF(custrecord_sr_job_family), ' '),  customrecord_sr_job_family.altname) AS jobfamily
		, customrecord_sr_job_profile_level.custrecord_jpl_joblevel AS level,
		, compensationcurrency AS currency
		, custentity_st_total_annual_compensation AS totalcompen
		, customrecord_sr_job_salary_range.name AS salaryrange
		, customrecord_sr_job_salary_range.custrecord_sr_range_low AS low
		, customrecord_sr_job_salary_range.custrecord_sr_range_high AS high
FROM   	employee
		, hcmjob
		, customrecord_sr_job_profile_level
		, customrecord_sr_job_family
		, customrecord_sr_job_salary_range 
WHERE  	employee.job = hcmjob.id
		AND hcmjob.id = customrecord_sr_job_profile_level. custrecord_jpl_jobprofile
		AND employee.job = customrecord_sr_job_salary_range.custrecord_sr_job_profile
		AND employee.currency = customrecord_sr_job_salary_range.custrecord_salary_range_currency
		AND hcmjob.custrecord_sr_job_family  = customrecord_sr_job_family.id
		AND customrecord_sr_job_salary_range.custrecord_sr_effective_date = '22-Sep-2021'
		AND employee.isinactive = 'F'