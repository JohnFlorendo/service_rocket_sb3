SELECT id AS id
	, custrecord_sr_hist_effective_date AS effectivedate,
	, custrecord_sr_hist_base_wage AS wage
	, custrecord_sr_annual_variable_target AS variable
	, custrecord_sr_total_target_comp AS tcc
FROM customrecord_sr_compensation_history
WHERE custrecord_ch_employee = {{id}}
	AND (custrecord_sr_hide_from_mycompensation != 'T' OR custrecord_sr_hide_from_mycompensation IS NULL)
	AND custrecord_sr_hist_effective_date <= BUILTIN.RELATIVE_RANGES('TODAY', 'END', 'DATE')
ORDER BY effectivedate DESC