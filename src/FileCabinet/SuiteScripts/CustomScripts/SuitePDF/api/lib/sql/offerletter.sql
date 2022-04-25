SELECT employee.entityid AS name
	, BUILTIN.DF(employee.subsidiary) AS subsidiary
	, BUILTIN.DF(employee.job) AS jobprofile
	, BUILTIN.DF(employee.employeetype) AS employeetype
	, CASE WHEN employee.custentity_primarypractice IS NOT NULL THEN 
		employee.custentity_primarypractice
		ELSE BUILTIN.DF(employee.department) END AS practice
	, employee.custentity_joexpirydate AS expirydate
	, BUILTIN.DF(employee.supervisor) AS supervisor
	, BUILTIN.DF(employee.custentity_atlas_chr_hr_rep) AS hrmanager
	, NVL(employee.basewage, 0) AS newsalary,
	, NVL(employee.custentity_st_total_annual_compensation, 0)  AS newtcc
	, NVL(employee.custentity_sr_total_annual_bonus, 0)  AS newstf
	, employee.compensationcurrency AS currency
	, currency.displaysymbol AS  currencysymbol
	, employee.hiredate AS startdate
	, BUILTIN.DF(employee.location) AS location
	, BUILTIN.DF(subsidiary.country) AS country
	, BUILTIN.DF(classification.custrecord_plan_budget_owner) AS budgetowner
	, stockoption.name AS commitnumber
	, stockoption.custrecord_sr_commit_qty AS stockquantity
	, subsidiary.custrecord_sr_payroll_day_of_month AS payrolldate
FROM employee
INNER JOIN currency
	ON employee.currency = currency.id
INNER JOIN subsidiary
	ON employee.subsidiary= subsidiary.id
INNER JOIN classification
	ON employee.class = classification.id
LEFT JOIN customrecord_sr_stock_option_commit stockoption
	ON employee.custentity_stockcommitment = stockoption.id
WHERE employee.id = {{id}}