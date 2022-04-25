SELECT BUILTIN.DF(allowance.custrecord_sr_allowance_subsidiary) AS subsidiary_grouped
	, BUILTIN.DF(allowance.custrecord_sr_subsidiary_allowance_type) AS allowance_type
	, BUILTIN.DF(allowance.custrecord_sr_allowance_crrncy) AS currency
	, MAX(allowance.custrecord_sr_allowance_effective_date) AS effective_date
	, MIN(allowance.custrecord_sr_subsidiary_allowance_amt) AS amount_numeric
FROM customrecord_sr_subsidiary_allowance_amt allowance
WHERE allowance.custrecord_sr_allowance_effective_date <= CURRENT_DATE
GROUP BY BUILTIN.DF(allowance.custrecord_sr_allowance_subsidiary)
	, BUILTIN.DF(allowance.custrecord_sr_subsidiary_allowance_type)
	, BUILTIN.DF(allowance.custrecord_sr_allowance_crrncy)
ORDER BY BUILTIN.DF(allowance.custrecord_sr_allowance_subsidiary)
	, BUILTIN.DF(allowance.custrecord_sr_subsidiary_allowance_type)