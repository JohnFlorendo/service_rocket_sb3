SELECT entityid AS name
	, custentity_sr_kolbeid AS kolbeid
FROM employee
WHERE custentity_sr_kolbeid IS NOT NULL
	AND isinactive = 'F'
ORDER BY entityid