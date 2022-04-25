SELECT promotion.id
	, promocycle.custrecord_sr_box_promocycle_email AS email
FROM customrecord_sr_promocycle promocycle
INNER JOIN customrecord_sr_rocketeer_promotion  promotion
	ON promocycle.id = promotion.custrecord_sr_promo_cycle
WHERE promocycle.id = {{id}}