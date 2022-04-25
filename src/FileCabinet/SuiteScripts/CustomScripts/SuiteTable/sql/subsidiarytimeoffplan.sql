SELECT BUILTIN.DF(TimeOffPlan.subsidiary) as subsidiary_grouped
	, TimeOffPlan.name as plan_name_grouped
	, TimeOffPlan.custrecord_sr_toplan_description AS description_truncate
	, BUILTIN.DF(TimeOffPlan.startmonth) start_month
	, TimeOffType.displayname as timeoff_displayname
	, TimeOffType.custrecord_sr_totype_description as timeoff_description_truncate
	, NVL2(TimeOffRule.entitlement,  TimeOffRule.entitlement || ' ' ||
	TimeOffRule.entitlementunit, null) as entitlement,
 	CASE TimeOffRule.accrualfrequency WHEN 'MONTHLY' THEN ' ' || ROUND (TimeOffRule.entitlement/12,4) || ' ' || TimeOffRule.entitlementunit || ' ' ||  TimeOffRule.accrualfrequency
   	   WHEN 'ANNUALLY' THEN TimeOffRule.entitlement || ' ' || TimeOffRule.entitlementunit || ' ' ||  TimeOffRule.accrualfrequency
  	ELSE ' ' END AS accrual,
	NVL2(NULLIF(TimeOffRule.minimumtenure,0),  TimeOffRule.minimumtenure || ' ' ||
	TimeOffRule.minimumtenureunit, null) as minimum_tenure,
	TimeOffType.color,
	BUILTIN.DF(TimeOffRule.accrualtype) accural_type,
	TimeOffRule.accruesbasedon accrues_based_on,
	NVL2(NULLIF(TimeOffType.minimumincrement,0),  TimeOffType.minimumincrement || ' ' ||
	TimeOffType.incrementunit, null) as minimum_increment,
	TimeOffType.istrackonly,
	BUILTIN.DF(TimeOffRule.accrualfrequency) as accrues_every,
	NVL2(NULLIF (TimeOffRule.setaccruallimit,'T'), null,
	TimeOffRule.accruallimit || ' ' ||
	TimeOffRule.accruallimitunit) as accural_limit,
	TimeOffRule.allowcarryover,
	TimeOffRule.isautomaticallyaccrue,
	TimeOffRule.expireunusedcarryover,
	NVL2(NULLIF (TimeOffRule.shouldlimitcarryover,'T'), null,
	TimeOffRule.maximumcarryover || ' ' ||
	TimeOffRule.maximumcarryoverunit) as maximum_carryover,
	NVL2(NULLIF (TimeOffRule.openingbalancefornewemployees,'ZERO'), TimeOffRule.openingbalancefornewemployees,
	0) as openingbalancefornewemployees,
	TimeOffRule.showexpiryalert
FROM TimeOffRule, TimeOffPlan, TimeOffType
WHERE TimeOffRule.timeoffplan = TimeOffPlan.id
	AND TimeOffRule.timeofftype = TimeOffType.id
	AND TimeOffPlan.isinactive = 'F'
ORDER BY BUILTIN.DF(TimeOffPlan.subsidiary), TimeOffPlan.name,TimeOffType.displayname

/*SELECT subsidiary.name AS subsidiary_grouped
	, timeoffplan.name AS time_off_plan_grouped
	, BUILTIN.DF(timeoffrule.timeofftype) AS time_off_type
	, timeoffrule.minimumtenure AS minimum_tenure 
	, timeoffrule.entitlement AS entitlement
	, timeoffrule.entitlementunit AS entitlement_unit
	, timeoffrule.isautomaticallyaccrue AS automatically_accrue 	
	, timeoffrule.accruesbasedon AS accrues_based_on
	, timeoffrule.accrualtype AS accrual_type
	, timeoffrule.accrualfrequency AS accrual_frequency
	, timeoffrule.openingbalancefornewemployees AS opening_balance_new_employees
FROM subsidiary
LEFT JOIN timeoffplan
	ON subsidiary.id = timeoffplan.subsidiary
INNER JOIN timeoffrule
	ON  timeoffplan.id = timeoffrule.timeoffplan
ORDER BY subsidiary.name, timeoffplan.name, BUILTIN.DF(timeoffrule.timeofftype)*/ 