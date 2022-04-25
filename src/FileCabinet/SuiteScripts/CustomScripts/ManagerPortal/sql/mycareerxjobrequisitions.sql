SELECT jobrequisition.id AS jobrequisitionid
	, BUILTIN.DF(mycareer.custrecord_myc_employee) AS employee 
	, BUILTIN.DF( interested.maptwo) AS interested 
	, '' AS working
FROM jobrequisition
INNER JOIN map_customrecord_mycareer_custrecord_myc_iamiterested interested
	ON jobrequisition.jobid  = interested.maptwo
INNER JOIN customrecord_mycareer AS mycareer
	ON  interested.mapone = mycareer.id

UNION

SELECT jobrequisition.id AS jobrequisitionid
	, BUILTIN.DF(mycareer.custrecord_myc_employee) AS employee 
	, '' AS interested 
	, BUILTIN.DF( working.maptwo) AS working
FROM jobrequisition
INNER JOIN map_customrecord_mycareer_custrecord_myc_workingtobe working
	ON jobrequisition.jobid  = working.maptwo
INNER JOIN customrecord_mycareer AS mycareer
	ON  working.mapone = mycareer.id

