/*0*/
SELECT  job.id AS projectinternalid
	, job.entityid AS projectid
	, job.companyname AS title
	, BUILTIN.DF(job.customer) AS customer
	, customer.custentity_hubspot_id AS customerhsid
	, BUILTIN.DF(job.projectmanager) AS projectmanager 
	, projectmanager.custentity_workplace_id AS pmworkplaceid
	, job.custentity_sr_workchat_thread_url AS wpchatgroup
	, BUILTIN.DF(job.entitystatus) AS status
	, job.startdate AS startdate 
	, job.calculatedenddate AS calculatedenddate
	, job.custentity_golive_date as golivedate
	, BUILTIN.DF(job.custentity4) AS lob
	, job.custentity_sr_box_folder_url AS boxfolder
	, LOWER(BUILTIN.DF(customrecord_rag_status.custrecord_rgs_status)) AS ragstatus
	, customrecord_rag_status.name AS ragsummary
	, customrecord_rag_status.custrecord_rgs_notes AS ragnotes
	, BUILTIN.DF(customrecord_rag_status.custrecord_rgs_author) AS ragauthor
	, customrecord_rag_status.custrecord_rgs_date AS ragdate
	, BUILTIN.DF(currency.displaysymbol) AS currencysymbol
	/*, transactionline.rate AS projectrate
	, job.plannedwork AS budgethours
	, transactionline.rate*job.plannedwork AS budgetamount*/
	, BUILTIN.DF(job.jobbillingtype) AS billingtype
	, BUILTIN.DF(job.billingschedule) AS billingschedule
	, BUILTIN.DF(job.jobtype) AS projecttype
	, BUILTIN.DF(custentity_sr_partner) AS partnerpractice
FROM  job
INNER JOIN customer
	ON job.customer = customer.id
LEFT JOIN customrecord_rag_status
	ON job.custentity_rag_summary  = customrecord_rag_status.id
INNER JOIN currency
	ON job.currency = currency.id
INNER JOIN employee projectmanager
	ON job.projectmanager = projectmanager.id
INNER JOIN jobresources
	ON job.id = jobresources.project
WHERE (job.id = ? OR  job.entityid = ?) AND jobresources.jobresource = ?
/*1*/
{{}}
SELECT BUILTIN.DF(jobresources.jobresource) AS resource
	, BUILTIN.DF(jobresources.role) AS role
	, jobresources.defaultcost AS cost
FROM jobresources
INNER JOIN job
	ON jobresources.project = job.id
WHERE jobresources.project = ? OR job.entityid = ?
/*2*/
{{}}
SELECT  projecttask.eventid AS id
	, projecttask.id AS internalid
	, projecttask.title AS name
	, CASE WHEN projecttask.status = 'COMPLETE' THEN '✅ Completed'
			WHEN projecttask.status = 'PROGRESS' THEN '▶ In Progress'	 
			ELSE '⏺ Not Started' END AS status
	, projecttask.startdatetime AS startdate
	, projecttask.enddate AS enddate
	, projecttask.plannedwork AS plannedwork 
	, projecttask.actualwork AS actualwork
	, projecttask.plannedwork - projecttask.actualwork AS remainingwork
	, projecttask.percenttimecomplete * 100 AS percentcomplete
	, projecttask.issummarytask AS isparent
	, projecttask.nonbillabletask AS nonbillable
	, projecttask.parent AS parent
FROM  projecttask
INNER JOIN job
	ON projecttask.project = job.id
WHERE projecttask.project = ? OR  job.entityid = ?
ORDER BY projecttask.eventid
/*3*/
{{}}/*Project List*/
SELECT id AS internalid
	, companyname AS name
	, entityid AS projectid
	, BUILTIN.DF(customer) AS customer
	, projectmanager AS projectmanagerid
	, BUILTIN.DF(projectmanager) AS projectmanager
	, BUILTIN.DF(entitystatus) AS status
FROM job
INNER JOIN jobresources
	ON job.id = jobresources.project
WHERE jobresources.jobresource = ?