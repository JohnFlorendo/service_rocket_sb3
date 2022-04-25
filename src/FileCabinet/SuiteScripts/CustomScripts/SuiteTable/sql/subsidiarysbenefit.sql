SELECT
	BUILTIN.DF(CUSTOMRECORD_SUBSIDIARY_BENEFIT.custrecord_sr_subsidiary) as subsidiary_grouped,
	BUILTIN.DF(CUSTOMRECORD_BT_PLAN.custrecord_bt_pl_type) as benefit_category,
	CUSTOMRECORD_BT_PLAN.name as benefit_name,
	CUSTOMRECORD_BT_PLAN.custrecord_bt_pl_description as benefit_description_truncate,
	BUILTIN.DF(CUSTOMRECORD_SUBSIDIARY_BENEFIT.custrecord_sr_benefits_carrier) as benefit_carrier,
	CUSTOMRECORD_BT_PLAN.created
FROM
	CUSTOMRECORD_BT_PLAN

,	CUSTOMRECORD_SUBSIDIARY_BENEFIT


WHERE 


CUSTOMRECORD_SUBSIDIARY_BENEFIT.custrecord_sr_benefits_carrier = CUSTOMRECORD_BT_PLAN.custrecord_bt_pl_carrier

AND
	CUSTOMRECORD_SUBSIDIARY_BENEFIT.isinactive = 'F'
AND
	CUSTOMRECORD_BT_PLAN.isinactive = 'F'