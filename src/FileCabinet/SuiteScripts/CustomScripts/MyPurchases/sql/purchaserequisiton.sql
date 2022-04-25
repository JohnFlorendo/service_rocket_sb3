SELECT requisition.tranid || '+/app/accounting/transactions/purchreq.nl?id=' || requisition.id AS pr_number_link
	, requisition.duedate AS due_date
	, BUILTIN.DF(requisition.entity) || '+https://servicerocket.workplace.com/chat/t/' || requestor.custentity_workplace_id AS requested_by_link
	, BUILTIN.DF(requisition.approvalstatus) AS approval_status
	, BUILTIN.DF(requisition.memo) AS memo_truncate
	, BUILTIN.DF(requisitionline.subsidiary) AS subsidiary
	, BUILTIN.DF(requisitionline.class) AS class
	, BUILTIN.DF(requisitionline.department) AS department
	, BUILTIN.DF(currency.symbol) AS currency_hide
	, requisitionline.estimatedamount AS amount_currency
	, BUILTIN.DF(requisition.nextapprover) AS approver
FROM transaction requisition
INNER JOIN transactionline requisitionline
	ON requisition.id = requisitionline.transaction
INNER JOIN classification
	ON requisitionline.class = classification.id
INNER JOIN employee requestor 
	ON requisition.entity = requestor.id
INNER JOIN currency
	ON requisition.currency = currency.id
WHERE requisition.type = 'PurchReq'
	AND requisitionline.mainline = 'F'
	AND (((requisition.nextapprover = ? OR classification.custrecord_plan_budget_owner = ?) AND requisition.approvalstatus = ?) OR requisition.entity = ?)
ORDER BY requisition.tranid DESC