SELECT * 
FROM
(

	SELECT opportunity.id AS opportunityid
		, invoice.id AS invoiceid
		, invoice.tranid || '+/app/accounting/transactions/custinvc.nl?id=' || invoice.id AS invoice_link
	   	, invoice.trandate AS invoice_date
	  	, BUILTIN.DF( invoice.status) AS invoice_status
	  	, invoiceline.createdfrom AS salesorder
	FROM customrecord_hsdeal deal 
	LEFT OUTER JOIN TRANSACTION opportunity 
		ON deal.custrecord_hsd_netsuiteid = opportunity.id 
	INNER JOIN TRANSACTION invoice 
	    ON opportunity.id = invoice.opportunity 
	    	AND invoice.type = 'CustInvc'
	INNER JOIN transactionline invoiceline
		ON invoice.id = invoiceline.transaction
	LEFT OUTER JOIN TRANSACTIONSALESTEAM
		ON opportunity.id = transactionSalesTeam.transaction
			AND transactionSalesTeam.isprimary = 'T'
	LEFT OUTER JOIN employee 
		ON transactionSalesTeam.employee = employee.id
	WHERE transactionSalesTeam.employee = ?
	ORDER BY opportunityid

)

GROUP BY opportunityid
	, invoiceid
	, invoice_link
  	, invoice_date
  	, invoice_status
	, salesorder
	
ORDER BY invoiceid