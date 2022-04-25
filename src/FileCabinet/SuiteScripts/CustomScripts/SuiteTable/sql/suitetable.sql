SELECT CONCAT(name, CONCAT( '+/app/site/hosting/scriptlet.nl?script=1483&deploy=1&stbl=', id)) AS name_link
	, custrecord_stbl_filelocation AS file_location
FROM customrecord_suitetable 
INNER JOIN map_customrecord_suitetable_custrecord_stbl_audience audience
	ON suiteable.id = audience.mapone
WHERE customrecord_suitetable.id > 1
	AND audience.maptwo = ?


