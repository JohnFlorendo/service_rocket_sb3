SELECT employee.entityid AS name
	, employee.custentity_employee_number AS employeenum,
	, employee.job AS jobid
	, BUILTIN.DF(employee.job) AS job
	, BUILTIN.DF(employee.supervisor) AS supervisor
	, BUILTIN.DF(employee.custentity_atlas_chr_hr_rep) AS hrmanager
	, hr.custentity_workplace_id AS hrmanagerworkplaceid
	, employee.subsidiary AS subsidiaryid
	, BUILTIN.DF(employee.subsidiary) AS subsidiary
	, subsidiary.custrecord_sr_employee_handbook AS subsidiaryhandbook
	, employee.hiredate
	, BUILTIN.DF(employee.location) AS location,
	, employee.lastreviewdate AS lastreviewdate
	, employee.nextreviewdate AS nextreviewdate
	, employee.basewage AS basewage
	, CASE WHEN employee.basewagetype = 'annualsalary' 
		THEN 'Annual Salary'  ELSE '' 
		END AS basewagetype 
	, employee.compensationcurrency AS compensationcurrency 
	, currency.displaysymbol AS currencysymbol
	, employee.custentity_sr_total_annual_bonus AS variable
	, CASE WHEN employee.bonustargettype = 'amount' THEN 'Amount' 
		WHEN employee.bonustargettype = 'percent' THEN 'Percent'  ELSE '' 
		END AS bonustargettype 
	, employee.bonustargetpayfrequency AS bonustargetpayfrequency 
	, employee.custentity_st_total_annual_compensation AS totalcompen
	, BUILTIN.DF(employee.custentity_payroll_provider) AS payrollprovider
	, payrollprovider.custrecord_sr_emp_portal_login_url AS payrollurl
	, joblevel.name AS joblevelname
	, joblevel.custrecord_sr_job_level_number AS joblevelnumber
	, CASE WHEN jobprofile.custrecord_sr_stf_ratio_guide_override IS NOT NULL THEN jobprofile.custrecord_sr_stf_ratio_guide_override
	ELSE joblevel.custrecord_stf_ratio_guideline * 100 END AS stfguideline
	, CASE WHEN jobprofile.custrecord_sr_stf_ratio_guide_override IS NOT NULL THEN 'Job Profile'
	ELSE 'Job Level' END AS stfguidelinefrom
	, CASE WHEN employee.custentity_sr_kolbeid IS NULL  THEN '-1'
	ELSE employee.custentity_sr_kolbeid
	END  AS kolbeid
	, employee.custentity_sr_kolbea AS kolbemo
	, employee.custentity_sr_kolbe_online_url AS kolbereport
	, employee.custentity_sr_kolbe_download_url AS kolbedownload
FROM employee
INNER JOIN hcmjob AS jobprofile
	ON employee.job = jobprofile.id
INNER JOIN employee AS hr
	ON employee.custentity_atlas_chr_hr_rep = hr.id
INNER JOIN subsidiary
	ON employee.subsidiary = subsidiary.id
INNER JOIN currency
	ON employee.compensationcurrency = currency.symbol
LEFT JOIN customrecord_payroll_provider AS payrollprovider
	ON employee.custentity_payroll_provider= payrollprovider.id
LEFT JOIN customrecord_sr_job_profile_level AS jobprofilelevel
	ON employee.job= jobprofilelevel.custrecord_jpl_jobprofile
LEFT JOIN customrecord_sr_job_level AS joblevel
	ON jobprofilelevel.custrecord_jpl_joblevel = joblevel.id
WHERE employee.id = {{id}}
	OR (employee.id = {{id}} AND  employee.custentity_atlas_chr_hr_rep = {{hrmanager}})
	OR (employee.id = {{id}} AND  employee.supervisor = {{manager}})