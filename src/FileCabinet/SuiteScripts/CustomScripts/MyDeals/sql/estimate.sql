SELECT opportunityid
	, estimateid
	, estimate_link
	, estimate_date
	, estimate_status
	, salesorderline.createdfrom AS salesorder
	, CASE WHEN salesorderline.createdfrom IS NULL THEN 'F' ELSE 'T' END AS winningestimate
FROM
(

	SELECT opportunity.id AS opportunityid
		, estimate.id AS estimateid
	   	, estimate.tranid || '+/app/accounting/transactions/estimate.nl?id=' || estimate.id AS estimate_link
	   	, estimate.trandate AS estimate_date
	   	, BUILTIN.DF( estimate.status) AS estimate_status
	FROM customrecord_hsdeal deal 
	LEFT OUTER JOIN transaction opportunity 
		ON deal.custrecord_hsd_netsuiteid = opportunity.id 
	LEFT OUTER JOIN transaction estimate 
	    ON opportunity.id = estimate.opportunity 
	      	AND estimate.type = 'Estimate' 
	     	AND estimate.status = 'B'
	LEFT OUTER JOIN transactionsalesteam
		ON opportunity.id = transactionsalesteam.transaction
			AND transactionsalesteam.isprimary = 'T'
	LEFT OUTER JOIN employee 
		ON transactionsalesteam.employee = employee.id
	WHERE transactionsalesteam.employee = ?
	
	UNION
	
	SELECT opportunity.id AS opportunityid
		, estimate.id AS estimateid
	   	, estimate.tranid || '+/app/accounting/transactions/estimate.nl?id=' || estimate.id AS estimate_link
	   	, estimate.trandate AS estimate_date
	   	, BUILTIN.DF( estimate.status) AS estimate_status
	FROM customrecord_hsdeal deal 
	LEFT OUTER JOIN transaction opportunity 
		ON deal.custrecord_hsd_netsuiteid = opportunity.id 
	LEFT OUTER JOIN transaction estimate
	   	ON opportunity.id = estimate.opportunity
	   		AND estimate.type = 'Estimate' 
	 		AND estimate.status <> 'B'
	LEFT OUTER JOIN transactionsalesteam
		ON opportunity.id = transactionsalesteam.transaction
			AND transactionsalesteam.isprimary = 'T'
	LEFT OUTER JOIN employee 
		ON transactionsalesteam.employee = employee.id
	WHERE transactionsalesteam.employee = ?
) estimate

LEFT JOIN transactionline salesorderline
		ON estimate.estimateid = salesorderline.createdfrom
GROUP BY opportunityid
	, estimateid
	, estimate_link
	, estimate_date
	, estimate_status
	, salesorderline.createdfrom

ORDER BY estimateid