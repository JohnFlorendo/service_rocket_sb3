SELECT opportunity.tranid || '+/app/accounting/transactions/opprtnty.nl?id=' || opportunity.id AS opportunity_link
  	, deal.custrecord_hsd_closeddate AS deal_closed_date
   	, opportunity.trandate AS opp_date
   	, deal.custrecord_hsd_customer || '+https://app.hubspot.com/contacts/296336/company/' || deal.custrecord_hsd_customerid AS deal_customer_link
   	, deal.name AS deal_name
   	, deal.custrecord_hsd_amount AS deal_amount_numeric
   	, deal.custrecord_hsd_currency AS deal_currency
   	, deal.custrecord_hsd_pipeline AS pipeline
	, CASE WHEN deal.custrecord_hsd_stage = 2302577 THEN 'Qualified(SQL)' 
	   WHEN deal.custrecord_hsd_stage = 2302578 THEN 'Value Map Matched' 
	   WHEN deal.custrecord_hsd_stage = 2302576 THEN 'Customer Profile Completed' 
	   WHEN deal.custrecord_hsd_stage = 2302574 THEN 'Appointment Scheduled' 
	   WHEN deal.custrecord_hsd_stage = 2302575 THEN 'Interest Received' 
	   WHEN deal.custrecord_hsd_stage = 2329726 THEN 'Disqualified'
	   WHEN deal.custrecord_hsd_stage = 2315021 THEN 'SETUP'
	   WHEN deal.custrecord_hsd_stage = 8 THEN 'Prospect-In Discussion'
	   WHEN deal.custrecord_hsd_stage = 9 THEN 'Prospect-Identified Decision Makers'
	   WHEN deal.custrecord_hsd_stage = 10 THEN 'Prospect-Proposal'
	   WHEN deal.custrecord_hsd_stage = 11 THEN 'Prospect-In Negotiation'
	   WHEN deal.custrecord_hsd_stage = 12 THEN 'Prospect-Purchasing'
	   WHEN deal.custrecord_hsd_stage = 13 THEN 'Customer-Closed Won'
	   WHEN deal.custrecord_hsd_stage = 15 THEN 'Customer-Renewal'
	   WHEN deal.custrecord_hsd_stage = 14 THEN 'Prospect-Closed Lost'
	   WHEN deal.custrecord_hsd_stage = 16 THEN 'Customer-Lost Customer'
	   WHEN deal.custrecord_hsd_stage = 9440409 THEN 'NetSuite Opp: In Progress'
	   WHEN deal.custrecord_hsd_stage = 9440410 THEN 'NetSuite Opp: Issued Estimate'
	   WHEN deal.custrecord_hsd_stage = 9440411 THEN 'NetSuite Opp: Closed Won'
	   WHEN deal.custrecord_hsd_stage = 9440412 THEN 'NetSuite Opp: Closed Lost'
	   ELSE 'OTHER' END AS deal_stage
   	, BUILTIN.DF(transactionSalesTeam.employee) as opp_salesrep
   	, '' AS bookings
   	, '' AS sales_order_hide
   	, '' AS invoice_hide
   	, opportunity.id AS opportunityid
   	, opportunity.status AS oppstatusid_hide
FROM customrecord_hsdeal deal 
LEFT OUTER JOIN transaction opportunity 
	ON deal.custrecord_hsd_netsuiteid = opportunity.id 
LEFT OUTER JOIN transactionsalesteam
	ON opportunity.id = transactionsalesteam.transaction
		AND transactionsalesteam.isprimary = 'T'
LEFT OUTER JOIN employee 
	ON transactionsalesteam.employee = employee.id
WHERE transactionsalesteam.employee = ?
	AND (BUILTIN.DF(opportunity.status) = ? OR BUILTIN.DF(opportunity.status) = ?) 