SELECT id
	, BUILTIN.DF(bonustype) AS bonustype
	, bonusamountabsolute AS amount
	, bonuscurrency
	, bonusawarddate AS awarddate
FROM bonus
WHERE bonusemployee = ?
ORDER BY awarddate DESC