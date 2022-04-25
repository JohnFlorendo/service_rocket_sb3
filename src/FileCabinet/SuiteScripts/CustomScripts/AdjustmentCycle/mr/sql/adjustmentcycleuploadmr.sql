SELECT adjustment.id
	, adjustmentcycle.custrecord_sr_box_adjustmentcycle_email AS email
FROM customrecord_sr_adjustmentcycle adjustmentcycle
INNER JOIN customrecord_sr_rocketeer_adjustment adjustment
	ON adjustmentcycle.id = adjustment.custrecord_sr_adjustment_cycle
WHERE adjustmentcycle.id = {{id}}
