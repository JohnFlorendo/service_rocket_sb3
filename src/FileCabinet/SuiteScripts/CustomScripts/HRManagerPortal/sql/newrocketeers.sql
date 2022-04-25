SELECT employee.externalid,
	, employee.custentity_employee_number AS empnum
	, employee.entityid AS name
	, employee.firstname AS firstname 
	, employee.lastname AS lastname 
	, employee.custentity_preferredname AS preferredname
	, CONCAT(NVL(employee.custentity_preferredname,CONCAT(employee.firstname,CONCAT(' ',employee.middlename))), CONCAT(' ',employee.lastname)) AS calculatedname
	, employee.email AS email
	, employee.phone AS phone
	, employee.officephone AS officephone
	, employee.mobilephone AS mobile
	, employee.fax AS fax
	, BUILTIN.DF(employee.job) AS job
	, CONCAT(CONCAT(CONCAT(joblevel.name, ' ('), joblevel.custrecord_sr_job_level_number), ')')  AS joblevelname
	, BUILTIN.DF(employee.supervisor) AS manager
	, BUILTIN.DF(manager.email) AS manageremail
	, BUILTIN.DF(employee.employeetype) AS employeetype
	, BUILTIN.DF(employee.custentity4) AS lob
	, BUILTIN.DF(employee.department) AS department
	, BUILTIN.DF(employee.location) AS location
	, BUILTIN.DF(employee.subsidiary) AS subsidiary
	, TO_CHAR(employee.birthdate, 'DD Month') AS birthdate
	, employee.hiredate  AS hiredate  
	, employee.lastreviewdate AS lastreviewdate
	, employee.nextreviewdate AS nextreviewdate
	, employee.releasedate AS releasedate
	, BUILTIN.DF(employee.employeestatus) AS employeestatus
	, employee.custentity_workplace_id AS workplaceid
	, BUILTIN.DF(employee.class) AS class
FROM employee
INNER JOIN employee AS manager
	ON employee.supervisor = manager.id
LEFT JOIN customrecord_sr_job_profile_level AS jobprofilelevel
	ON employee.job= jobprofilelevel.custrecord_jpl_jobprofile
LEFT JOIN customrecord_sr_job_level AS joblevel
	ON jobprofilelevel.custrecord_jpl_joblevel = joblevel.id
WHERE employee.custentity_atlas_chr_hr_rep = {{id}}
	AND employee.isinactive = 'F'
	AND employee.hiredate BETWEEN BUILTIN.RELATIVE_RANGES('DFN0', 'START', 'DATE') 
	AND BUILTIN.RELATIVE_RANGES('DFN90', 'END', 'DATE')