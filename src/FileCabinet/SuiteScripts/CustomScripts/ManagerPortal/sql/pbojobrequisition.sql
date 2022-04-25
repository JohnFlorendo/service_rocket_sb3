SELECT '' AS  ' '
	, jobrequisition.id AS id
	, CONCAT(CONCAT(hcmjob.custrecord_sr_job_code, ' '), jobrequisition.title)  AS title
	, BUILTIN.DF(jobrequisition.requisitionstatus) AS status
	, jobrequisition.headcount AS headcount
	, BUILTIN.DF(jobrequisition.custrecord_sr_req_primary_practice) AS partner_practice 
	, BUILTIN.DF(jobrequisition.location) AS location
	, jobrequisition.custrecord_jr_backfill AS backfill
	, NVL(jobrequisition.custrecord_jr_salaryrange_min, 0) AS tcc_low
	, NVL(jobrequisition.custrecord_jr_salaryrange_max, 0) AS tcc_high
	, NVL(jobrequisition.custrecord_jr_salaryrange_max, 0) AS budget
	, jobrequisition.targethiredate AS target_hire_date
	, currency.symbol AS currency
	, BUILTIN.DF(jobrequisition.hiringmanager) AS hiring_manager
	, jobrequisition.requisitionstatus AS statusid
	, '' AS stickies
	, BUILTIN.DF(jobrequisition.custrecord_jr_soestimate) AS sales_order_or_estimate
	, jobrequisition.custrecord_jr_leverid AS lever_id
	, BUILTIN.DF(jobrequisition.approvedby) AS approved_by
FROM jobrequisition
INNER JOIN classification
	ON jobrequisition.class = classification.id
INNER JOIN hcmjob
	ON jobrequisition.jobid = hcmjob.id
INNER JOIN subsidiary
	ON jobrequisition.subsidiary = subsidiary.id
INNER JOIN currency
	ON subsidiary.currency = currency.id
WHERE (classification.custrecord_plan_budget_owner = ? 
		OR classification.custrecord_plan_budget_owner > ?)