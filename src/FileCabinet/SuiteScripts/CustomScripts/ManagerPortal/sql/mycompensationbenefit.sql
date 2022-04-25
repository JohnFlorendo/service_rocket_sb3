SELECT BUILTIN.DF(customrecord_bt_plan.custrecord_bt_pl_type) AS type
	, BUILTIN.DF(customrecord_bt_plan.custrecord_bt_pl_carrier) AS carrier
	, customrecord_bt_plan.custrecord_bt_pl_description AS description
	, customrecord_bt_plan_tier.customrecord_bt_plan_tier.name AS tiername
	, customrecord_bt_plan_tier.custrecord_bt_pt_employee_cost AS employeecost
	, customrecord_bt_plan_tier.custrecord_bt_pt_employer_cost AS employercost
FROM customrecord_subsidiary_benefit
INNER JOIN customrecord_bt_plan
	ON customrecord_subsidiary_benefit.custrecord_sr_benefits_carrier = customrecord_bt_plan.custrecord_bt_pl_carrier
INNER JOIN customrecord_bt_plan_tier
	ON customrecord_bt_plan.id = customrecord_bt_plan_tier.custrecord_bt_pt_benefit_plan_k
WHERE custrecord_sr_subsidiary = ?