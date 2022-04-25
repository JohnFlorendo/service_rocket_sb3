SELECT id
	, BUILTIN.DF(custrecord_pc_allowance_type) AS type
	, custrecord_sr_pc_allowance_start_date AS startdate
	, custrecord_sr_pc_allowance_end_date AS enddate
	, custrecord_sr_pc_allowance_amount AS amount
FROM customrecord_sr_pay_cycle_allowance
WHERE isinactive = 'F'
	AND custrecord_sr_pc_allowance_employee = ?
ORDER BY  startdate DESC