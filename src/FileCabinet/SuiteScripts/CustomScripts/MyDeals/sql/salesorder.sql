SELECT * 
FROM
(

	SELECT opportunity.id AS opportunityid
		, salesorder.id AS salesorderid
		, salesorder.tranid || '+/app/accounting/transactions/salesord.nl?id=' || salesorder.id AS sales_order_link
	  	, salesorder.trandate AS sales_order_date
	  	, BUILTIN.DF( salesorder.status) AS salesorder_status
	  	, salesorderline.createdfrom AS estimate
	FROM customrecord_hsdeal deal 
	LEFT OUTER JOIN transaction opportunity 
		ON deal.custrecord_hsd_netsuiteid = opportunity.id 
	INNER JOIN transaction salesorder 
	    ON opportunity.id = salesorder.opportunity 
	    	AND salesorder.type = 'SalesOrd' 
	INNER JOIN transactionline salesorderline
		ON salesorder.id = salesorderline.transaction
	LEFT OUTER JOIN transactionsalesteam
		ON opportunity.id = transactionsalesteam.transaction
			AND transactionsalesteam.isprimary = 'T'
	LEFT OUTER JOIN employee 
		ON transactionsalesteam.employee = employee.id
	WHERE transactionsalesteam.employee = ?
	ORDER BY opportunityid

)

GROUP BY opportunityid
	, salesorderid
	, sales_order_link
  	, sales_order_date
  	, salesorder_status 
	, estimate

ORDER BY salesorderid
