INSERT INTO units (code,description) VALUES ('USD million','USD million') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('years','years') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('USD/GPU','USD/GPU') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('USD/GPU-hour','USD/GPU-hour') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('MWh','MWh') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('powerPriceUsdMwh','power Price Usd Mwh','USD/MWh',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-powerPriceUsdMwh',(SELECT id FROM designs WHERE seed_key='university-design'),'powerPriceUsdMwh',80,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-powerPriceUsdMwh',(SELECT id FROM designs WHERE seed_key='university-design'),'power Price Usd Mwh is an illustrative planning assumption.','assumption',80,'USD/MWh',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-powerPriceUsdMwh-powerPriceUsdMwh',(SELECT id FROM design_claims WHERE seed_key='content-powerPriceUsdMwh'),'input','powerPriceUsdMwh') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('utilizationPct','utilization Pct','%',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-utilizationPct',(SELECT id FROM designs WHERE seed_key='university-design'),'utilizationPct',65,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-utilizationPct',(SELECT id FROM designs WHERE seed_key='university-design'),'utilization Pct is an illustrative planning assumption.','assumption',65,'%',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-utilizationPct-utilizationPct',(SELECT id FROM design_claims WHERE seed_key='content-utilizationPct'),'input','utilizationPct') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('gpuCount','gpu Count','count',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-gpuCount',(SELECT id FROM designs WHERE seed_key='university-design'),'gpuCount',12000,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-gpuCount',(SELECT id FROM designs WHERE seed_key='university-design'),'gpu Count is an illustrative planning assumption.','assumption',12000,'count',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-gpuCount-gpuCount',(SELECT id FROM design_claims WHERE seed_key='content-gpuCount'),'input','gpuCount') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('buildCapexMillions','build Capex Millions','USD million',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-buildCapexMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'buildCapexMillions',480,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-buildCapexMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'build Capex Millions is an illustrative planning assumption.','assumption',480,'USD million',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-buildCapexMillions-buildCapexMillions',(SELECT id FROM design_claims WHERE seed_key='content-buildCapexMillions'),'input','buildCapexMillions') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('hybridCapexMillions','hybrid Capex Millions','USD million',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-hybridCapexMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'hybridCapexMillions',210,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-hybridCapexMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'hybrid Capex Millions is an illustrative planning assumption.','assumption',210,'USD million',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-hybridCapexMillions-hybridCapexMillions',(SELECT id FROM design_claims WHERE seed_key='content-hybridCapexMillions'),'input','hybridCapexMillions') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('annualLeaseMillions','annual Lease Millions','USD million',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-annualLeaseMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'annualLeaseMillions',92,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-annualLeaseMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'annual Lease Millions is an illustrative planning assumption.','assumption',92,'USD million',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-annualLeaseMillions-annualLeaseMillions',(SELECT id FROM design_claims WHERE seed_key='content-annualLeaseMillions'),'input','annualLeaseMillions') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('hybridLeaseMillions','hybrid Lease Millions','USD million',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-hybridLeaseMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'hybridLeaseMillions',48,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-hybridLeaseMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'hybrid Lease Millions is an illustrative planning assumption.','assumption',48,'USD million',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-hybridLeaseMillions-hybridLeaseMillions',(SELECT id FROM design_claims WHERE seed_key='content-hybridLeaseMillions'),'input','hybridLeaseMillions') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('annualNonPowerOpsMillions','annual Non Power Ops Millions','USD million',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-annualNonPowerOpsMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'annualNonPowerOpsMillions',38,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-annualNonPowerOpsMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'annual Non Power Ops Millions is an illustrative planning assumption.','assumption',38,'USD million',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-annualNonPowerOpsMillions-annualNonPowerOpsMillions',(SELECT id FROM design_claims WHERE seed_key='content-annualNonPowerOpsMillions'),'input','annualNonPowerOpsMillions') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('delayCarryingMillionsPerMonth','delay Carrying Millions Per Month','ratio',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-delayCarryingMillionsPerMonth',(SELECT id FROM designs WHERE seed_key='university-design'),'delayCarryingMillionsPerMonth',2,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-delayCarryingMillionsPerMonth',(SELECT id FROM designs WHERE seed_key='university-design'),'delay Carrying Millions Per Month is an illustrative planning assumption.','assumption',2,'ratio',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-delayCarryingMillionsPerMonth-delayCarryingMillionsPerMonth',(SELECT id FROM design_claims WHERE seed_key='content-delayCarryingMillionsPerMonth'),'input','delayCarryingMillionsPerMonth') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('gridDelayMonths','grid Delay Months','months',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-gridDelayMonths',(SELECT id FROM designs WHERE seed_key='university-design'),'gridDelayMonths',0.5,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-gridDelayMonths',(SELECT id FROM designs WHERE seed_key='university-design'),'grid Delay Months is an illustrative planning assumption.','assumption',0.5,'months',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-gridDelayMonths-gridDelayMonths',(SELECT id FROM design_claims WHERE seed_key='content-gridDelayMonths'),'input','gridDelayMonths') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('gpuPriceUsd','gpu Price Usd','USD/GPU',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-gpuPriceUsd',(SELECT id FROM designs WHERE seed_key='university-design'),'gpuPriceUsd',20000,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-gpuPriceUsd',(SELECT id FROM designs WHERE seed_key='university-design'),'gpu Price Usd is an illustrative planning assumption.','assumption',20000,'USD/GPU',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-gpuPriceUsd-gpuPriceUsd',(SELECT id FROM design_claims WHERE seed_key='content-gpuPriceUsd'),'input','gpuPriceUsd') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('gridUpgradeMillions','grid Upgrade Millions','USD million',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-gridUpgradeMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'gridUpgradeMillions',30,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-gridUpgradeMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'grid Upgrade Millions is an illustrative planning assumption.','assumption',30,'USD million',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-gridUpgradeMillions-gridUpgradeMillions',(SELECT id FROM design_claims WHERE seed_key='content-gridUpgradeMillions'),'input','gridUpgradeMillions') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('landMillions','land Millions','USD million',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-landMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'landMillions',10,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-landMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'land Millions is an illustrative planning assumption.','assumption',10,'USD million',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-landMillions-landMillions',(SELECT id FROM design_claims WHERE seed_key='content-landMillions'),'input','landMillions') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('staffMillions','staff Millions','USD million',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-staffMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'staffMillions',12,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-staffMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'staff Millions is an illustrative planning assumption.','assumption',12,'USD million',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-staffMillions-staffMillions',(SELECT id FROM design_claims WHERE seed_key='content-staffMillions'),'input','staffMillions') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('maintenanceMillions','maintenance Millions','USD million',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-maintenanceMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'maintenanceMillions',8,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-maintenanceMillions',(SELECT id FROM designs WHERE seed_key='university-design'),'maintenance Millions is an illustrative planning assumption.','assumption',8,'USD million',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-maintenanceMillions-maintenanceMillions',(SELECT id FROM design_claims WHERE seed_key='content-maintenanceMillions'),'input','maintenanceMillions') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('constructionMonths','construction Months','months',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-constructionMonths',(SELECT id FROM designs WHERE seed_key='university-design'),'constructionMonths',18,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-constructionMonths',(SELECT id FROM designs WHERE seed_key='university-design'),'construction Months is an illustrative planning assumption.','assumption',18,'months',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-constructionMonths-constructionMonths',(SELECT id FROM design_claims WHERE seed_key='content-constructionMonths'),'input','constructionMonths') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('replacementYears','replacement Years','years',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-replacementYears',(SELECT id FROM designs WHERE seed_key='university-design'),'replacementYears',4,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-replacementYears',(SELECT id FROM designs WHERE seed_key='university-design'),'replacement Years is an illustrative planning assumption.','assumption',4,'years',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-replacementYears-replacementYears',(SELECT id FROM design_claims WHERE seed_key='content-replacementYears'),'input','replacementYears') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('debtSharePct','debt Share Pct','%',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-debtSharePct',(SELECT id FROM designs WHERE seed_key='university-design'),'debtSharePct',60,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-debtSharePct',(SELECT id FROM designs WHERE seed_key='university-design'),'debt Share Pct is an illustrative planning assumption.','assumption',60,'%',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-debtSharePct-debtSharePct',(SELECT id FROM design_claims WHERE seed_key='content-debtSharePct'),'input','debtSharePct') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('debtRatePct','debt Rate Pct','%',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-debtRatePct',(SELECT id FROM designs WHERE seed_key='university-design'),'debtRatePct',7,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-debtRatePct',(SELECT id FROM designs WHERE seed_key='university-design'),'debt Rate Pct is an illustrative planning assumption.','assumption',7,'%',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-debtRatePct-debtRatePct',(SELECT id FROM design_claims WHERE seed_key='content-debtRatePct'),'input','debtRatePct') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('debtTermYears','debt Term Years','years',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-debtTermYears',(SELECT id FROM designs WHERE seed_key='university-design'),'debtTermYears',10,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-debtTermYears',(SELECT id FROM designs WHERE seed_key='university-design'),'debt Term Years is an illustrative planning assumption.','assumption',10,'years',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-debtTermYears-debtTermYears',(SELECT id FROM design_claims WHERE seed_key='content-debtTermYears'),'input','debtTermYears') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('discountRatePct','discount Rate Pct','%',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-discountRatePct',(SELECT id FROM designs WHERE seed_key='university-design'),'discountRatePct',8,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-discountRatePct',(SELECT id FROM designs WHERE seed_key='university-design'),'discount Rate Pct is an illustrative planning assumption.','assumption',8,'%',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-discountRatePct-discountRatePct',(SELECT id FROM design_claims WHERE seed_key='content-discountRatePct'),'input','discountRatePct') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('availabilityPct','availability Pct','%',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-availabilityPct',(SELECT id FROM designs WHERE seed_key='university-design'),'availabilityPct',99.5,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-availabilityPct',(SELECT id FROM designs WHERE seed_key='university-design'),'availability Pct is an illustrative planning assumption.','assumption',99.5,'%',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-availabilityPct-availabilityPct',(SELECT id FROM design_claims WHERE seed_key='content-availabilityPct'),'input','availabilityPct') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('salvagePct','salvage Pct','%',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-salvagePct',(SELECT id FROM designs WHERE seed_key='university-design'),'salvagePct',20,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-salvagePct',(SELECT id FROM designs WHERE seed_key='university-design'),'salvage Pct is an illustrative planning assumption.','assumption',20,'%',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-salvagePct-salvagePct',(SELECT id FROM design_claims WHERE seed_key='content-salvagePct'),'input','salvagePct') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('leaseEscalationPct','lease Escalation Pct','%',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-leaseEscalationPct',(SELECT id FROM designs WHERE seed_key='university-design'),'leaseEscalationPct',2,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-leaseEscalationPct',(SELECT id FROM designs WHERE seed_key='university-design'),'lease Escalation Pct is an illustrative planning assumption.','assumption',2,'%',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-leaseEscalationPct-leaseEscalationPct',(SELECT id FROM design_claims WHERE seed_key='content-leaseEscalationPct'),'input','leaseEscalationPct') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('hybridOwnedPct','hybrid Owned Pct','%',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-hybridOwnedPct',(SELECT id FROM designs WHERE seed_key='university-design'),'hybridOwnedPct',50,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-hybridOwnedPct',(SELECT id FROM designs WHERE seed_key='university-design'),'hybrid Owned Pct is an illustrative planning assumption.','assumption',50,'%',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-hybridOwnedPct-hybridOwnedPct',(SELECT id FROM design_claims WHERE seed_key='content-hybridOwnedPct'),'input','hybridOwnedPct') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('hybridPhaseYear','hybrid Phase Year','years',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-hybridPhaseYear',(SELECT id FROM designs WHERE seed_key='university-design'),'hybridPhaseYear',3,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-hybridPhaseYear',(SELECT id FROM designs WHERE seed_key='university-design'),'hybrid Phase Year is an illustrative planning assumption.','assumption',3,'years',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-hybridPhaseYear-hybridPhaseYear',(SELECT id FROM design_claims WHERE seed_key='content-hybridPhaseYear'),'input','hybridPhaseYear') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('memberChargeUsdHour','member Charge Usd Hour','USD/GPU-hour',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-memberChargeUsdHour',(SELECT id FROM designs WHERE seed_key='university-design'),'memberChargeUsdHour',0,'assumption','Zero recovery is an explicit cost-only scenario, not a missing-value placeholder; no signed member revenue is assumed.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-memberChargeUsdHour',(SELECT id FROM designs WHERE seed_key='university-design'),'member Charge Usd Hour is an illustrative planning assumption.','assumption',0,'USD/GPU-hour',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-memberChargeUsdHour-memberChargeUsdHour',(SELECT id FROM design_claims WHERE seed_key='content-memberChargeUsdHour'),'input','memberChargeUsdHour') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('smallInstitutionReservePct','small Institution Reserve Pct','%',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-smallInstitutionReservePct',(SELECT id FROM designs WHERE seed_key='university-design'),'smallInstitutionReservePct',20,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-smallInstitutionReservePct',(SELECT id FROM designs WHERE seed_key='university-design'),'small Institution Reserve Pct is an illustrative planning assumption.','assumption',20,'%',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-smallInstitutionReservePct-smallInstitutionReservePct',(SELECT id FROM design_claims WHERE seed_key='content-smallInstitutionReservePct'),'input','smallInstitutionReservePct') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('singleMemberCapPct','single Member Cap Pct','%',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-singleMemberCapPct',(SELECT id FROM designs WHERE seed_key='university-design'),'singleMemberCapPct',35,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-singleMemberCapPct',(SELECT id FROM designs WHERE seed_key='university-design'),'single Member Cap Pct is an illustrative planning assumption.','assumption',35,'%',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-singleMemberCapPct-singleMemberCapPct',(SELECT id FROM design_claims WHERE seed_key='content-singleMemberCapPct'),'input','singleMemberCapPct') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('gridOutageHours','grid Outage Hours','hours',0,NULL,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,source_id,created_at) VALUES ('content-P-gridOutageHours',(SELECT id FROM designs WHERE seed_key='university-design'),'gridOutageHours',48,'assumption','Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',(SELECT id FROM sources WHERE seed_key='S63'),'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-gridOutageHours',(SELECT id FROM designs WHERE seed_key='university-design'),'grid Outage Hours is an illustrative planning assumption.','assumption',48,'hours',NULL,NULL,'draft','medium','economics','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-gridOutageHours-gridOutageHours',(SELECT id FROM design_claims WHERE seed_key='content-gridOutageHours'),'input','gridOutageHours') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-grid_outage_hours',(SELECT id FROM designs WHERE seed_key='university-design'),'Grid outage duration.','calculation',NULL,'hours','grid_outage_hours',NULL,'draft','medium','design','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-grid_outage_hours-gridOutageHours',(SELECT id FROM design_claims WHERE seed_key='content-grid_outage_hours'),'input','gridOutageHours') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-backup_energy_mwh',(SELECT id FROM designs WHERE seed_key='university-design'),'Required delivered electrical energy during the reference grid outage.','calculation',NULL,'MWh','backup_energy_mwh',NULL,'draft','medium','design','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-backup_energy_mwh-gridOutageHours',(SELECT id FROM design_claims WHERE seed_key='content-backup_energy_mwh'),'input','gridOutageHours') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-backup_energy_mwh-it_load_mw',(SELECT id FROM design_claims WHERE seed_key='content-backup_energy_mwh'),'input','it_load_mw') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-backup_energy_mwh-pue',(SELECT id FROM design_claims WHERE seed_key='content-backup_energy_mwh'),'input','pue') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-small_institution_reserve',(SELECT id FROM designs WHERE seed_key='university-design'),'Proposed consortium capacity-allocation rule.','design_decision',NULL,'%',NULL,NULL,'draft','medium','design','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-small_institution_reserve-smallInstitutionReservePct',(SELECT id FROM design_claims WHERE seed_key='content-small_institution_reserve'),'input','smallInstitutionReservePct') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-single_member_cap',(SELECT id FROM designs WHERE seed_key='university-design'),'Proposed consortium capacity-allocation rule.','design_decision',NULL,'%',NULL,NULL,'draft','medium','design','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('content-link-single_member_cap-singleMemberCapPct',(SELECT id FROM design_claims WHERE seed_key='content-single_member_cap'),'input','singleMemberCapPct') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-development-gap',(SELECT id FROM designs WHERE seed_key='university-design'),'Site control, member demand survey, allocation agreement and preliminary utility response. These documents have not yet been supplied.','unknown',NULL,NULL,NULL,NULL,'draft','medium','financing','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO evidence_requirements (seed_key,design_id,stage,requirement_text,sort_order,created_at) VALUES ('content-development',(SELECT id FROM designs WHERE seed_key='university-design'),'development_equity','Site control, member demand survey, allocation agreement and preliminary utility response.',0,'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO requirement_claims (requirement_id,claim_id) VALUES ((SELECT id FROM evidence_requirements WHERE seed_key='content-development'),(SELECT id FROM design_claims WHERE seed_key='content-development-gap')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-construction-gap',(SELECT id FROM designs WHERE seed_key='university-design'),'Written energization date and upgrade cost, permits, priced construction and resilience design, and signed member commitments. These documents have not yet been supplied.','unknown',NULL,NULL,NULL,NULL,'draft','medium','financing','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO evidence_requirements (seed_key,design_id,stage,requirement_text,sort_order,created_at) VALUES ('content-construction',(SELECT id FROM designs WHERE seed_key='university-design'),'construction_debt','Written energization date and upgrade cost, permits, priced construction and resilience design, and signed member commitments.',1,'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO requirement_claims (requirement_id,claim_id) VALUES ((SELECT id FROM evidence_requirements WHERE seed_key='content-construction'),(SELECT id FROM design_claims WHERE seed_key='content-construction-gap')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('content-equipment-gap',(SELECT id FROM designs WHERE seed_key='university-design'),'GPU quotation, performance acceptance, replacement and service-level plan, utilization commitments and member credit support. These documents have not yet been supplied.','unknown',NULL,NULL,NULL,NULL,'draft','medium','financing','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO evidence_requirements (seed_key,design_id,stage,requirement_text,sort_order,created_at) VALUES ('content-equipment',(SELECT id FROM designs WHERE seed_key='university-design'),'equipment_financing','GPU quotation, performance acceptance, replacement and service-level plan, utilization commitments and member credit support.',2,'2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO requirement_claims (requirement_id,claim_id) VALUES ((SELECT id FROM evidence_requirements WHERE seed_key='content-equipment'),(SELECT id FROM design_claims WHERE seed_key='content-equipment-gap')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narratives (seed_key,design_id,kind,key,version,title,created_at) VALUES ('content-failure_largest_component',(SELECT id FROM designs WHERE seed_key='university-design'),'failure_walkthrough','failure_largest_component',1,'Largest transformer failure','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-failure_largest_component-0',(SELECT id FROM narratives WHERE seed_key='content-failure_largest_component'),1,'Protective relays isolate the failed transformer and open its breakers; the remaining path must be rated for the required critical load.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-failure_largest_component-1',(SELECT id FROM narratives WHERE seed_key='content-failure_largest_component'),2,'UPS bridges the transfer while operators verify the alternate supply and cooling pumps. No uptime credit is assigned to untested transfer behavior.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-failure_largest_component-2',(SELECT id FROM narratives WHERE seed_key='content-failure_largest_component'),3,'Shed discretionary batch jobs before interrupting teaching, critical inference or storage integrity; checkpoint long-running training when available capacity is insufficient.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-failure_largest_component-3',(SELECT id FROM narratives WHERE seed_key='content-failure_largest_component'),4,'Return only after fault clearance and a witnessed load test. Transformer ratings, selective coordination, UPS autonomy and common-mode faults require the site engineering study.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narratives (seed_key,design_id,kind,key,version,title,created_at) VALUES ('content-failure_grid_48h',(SELECT id FROM designs WHERE seed_key='university-design'),'failure_walkthrough','failure_grid_48h',1,'Extended grid outage','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-failure_grid_48h-0',(SELECT id FROM narratives WHERE seed_key='content-failure_grid_48h'),1,'The reference outage lasts {claim:grid_outage_hours}. At full facility demand it requires {claim:backup_energy_mwh} of delivered backup energy.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO step_claims (step_id,claim_id) VALUES ((SELECT id FROM narrative_steps WHERE seed_key='content-failure_grid_48h-0'),(SELECT id FROM design_claims WHERE seed_key='content-grid_outage_hours')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO step_claims (step_id,claim_id) VALUES ((SELECT id FROM narrative_steps WHERE seed_key='content-failure_grid_48h-0'),(SELECT id FROM design_claims WHERE seed_key='content-backup_energy_mwh')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-failure_grid_48h-1',(SELECT id FROM narratives WHERE seed_key='content-failure_grid_48h'),2,'UPS bridges generator startup; the protected cooling, controls, network and storage remain on the critical-power path.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-failure_grid_48h-2',(SELECT id FROM narratives WHERE seed_key='content-failure_grid_48h'),3,'Fuel quantity equals delivered backup energy divided by the tested generator electrical yield per unit of fuel. The fuel yield and usable tank capacity are not established; procurement requires both, a reserve and a refuelling contract.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-failure_grid_48h-3',(SELECT id FROM narratives WHERE seed_key='content-failure_grid_48h'),4,'Shed flexible training first, then nonessential teaching; preserve critical inference, network controls, safe cooling and storage shutdown. Resupply access, permits, restart time and simultaneous generator failures must be tested.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narratives (seed_key,design_id,kind,key,version,title,created_at) VALUES ('content-grid_impact',(SELECT id FROM designs WHERE seed_key='university-design'),'grid_impact','grid_impact',1,'Grid and community impact','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-grid_impact-0',(SELECT id FROM narratives WHERE seed_key='content-grid_impact'),1,'The utility sees {claim:facility_power_mw} peak facility demand and {claim:annual_energy_gwh} annual energy at the operating baseline.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO step_claims (step_id,claim_id) VALUES ((SELECT id FROM narrative_steps WHERE seed_key='content-grid_impact-0'),(SELECT id FROM design_claims WHERE seed_key='facility_power_mw')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO step_claims (step_id,claim_id) VALUES ((SELECT id FROM narrative_steps WHERE seed_key='content-grid_impact-0'),(SELECT id FROM design_claims WHERE seed_key='annual_energy_gwh')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-grid_impact-1',(SELECT id FROM narratives WHERE seed_key='content-grid_impact'),2,'Stage cluster startup and cap load ramps; flexible batch work may be curtailed under an agreed utility protocol without promising that critical workloads can always stop.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-grid_impact-2',(SELECT id FROM narratives WHERE seed_key='content-grid_impact'),3,'Do not credit annual renewable certificates as firm hourly backup. No onsite solar, wind, gas or storage contribution is assumed in the adequacy calculation.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-grid_impact-3',(SELECT id FROM narratives WHERE seed_key='content-grid_impact'),4,'The interconnection study must establish upgrades, fault levels, power quality, curtailment rights and who pays. Allocate project-driven upgrades to the consortium rather than assuming other customers subsidize them.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narratives (seed_key,design_id,kind,key,version,title,created_at) VALUES ('content-capacity_sharing',(SELECT id FROM designs WHERE seed_key='university-design'),'access_policy','capacity_sharing',1,'Fair capacity and cost allocation','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-capacity_sharing-0',(SELECT id FROM narratives WHERE seed_key='content-capacity_sharing'),1,'Reserve {claim:small_institution_reserve} of discretionary productive capacity for smaller institutions and teaching; cap any one member at {claim:single_member_cap} of discretionary allocation.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO step_claims (step_id,claim_id) VALUES ((SELECT id FROM narrative_steps WHERE seed_key='content-capacity_sharing-0'),(SELECT id FROM design_claims WHERE seed_key='content-small_institution_reserve')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO step_claims (step_id,claim_id) VALUES ((SELECT id FROM narrative_steps WHERE seed_key='content-capacity_sharing-0'),(SELECT id FROM design_claims WHERE seed_key='content-single_member_cap')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-capacity_sharing-1',(SELECT id FROM narratives WHERE seed_key='content-capacity_sharing'),2,'Assign reserved capacity through take-or-pay commitments and transparent peer review. Release unused reservations to a common queue; large training jobs use scheduled blocks while teaching and inference receive protected windows.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-capacity_sharing-2',(SELECT id FROM narratives WHERE seed_key='content-capacity_sharing'),3,'Charge fixed costs by reserved capacity and variable costs by metered use. Publish utilization, queue time and allocation outcomes. An independent scientific panel hears appeals and conflicts of interest are disclosed.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-capacity_sharing-3',(SELECT id FROM narratives WHERE seed_key='content-capacity_sharing'),4,'The consortium board owns the facility, approves prices and admits members. Universities retain data ownership. Contract construction, utility supply and specialist operations with performance and security obligations.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narratives (seed_key,design_id,kind,key,version,title,created_at) VALUES ('content-workload_requirements',(SELECT id FROM designs WHERE seed_key='university-design'),'access_policy','workload_requirements',1,'What the members must demonstrate','2026-10-06T21:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-workload_requirements-0',(SELECT id FROM narratives WHERE seed_key='content-workload_requirements'),1,'Training researchers need contiguous GPU allocations and checkpoint storage; teaching users need scheduled sessions, and inference services need responsive protected capacity.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-workload_requirements-1',(SELECT id FROM narratives WHERE seed_key='content-workload_requirements'),2,'Productive GPU-hour demand, reservation timing and signed minimum commitments are not established. The modeled GPU-hours are capacity, not proof of demand; the facility scale remains conditional on the member survey.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-workload_requirements-2',(SELECT id FROM narratives WHERE seed_key='content-workload_requirements'),3,'Set workload-specific availability and recovery objectives. Separate tenants and sensitive datasets, use least privilege and encryption, log administrator actions and test restore procedures.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO narrative_steps (seed_key,narrative_id,step_no,step_text) VALUES ('content-workload_requirements-3',(SELECT id FROM narratives WHERE seed_key='content-workload_requirements'),4,'The consortium owns the facility and GPU fleet in the build case; lease purchases managed capacity. The hybrid contracts immediate access and defers owned capacity until financing gates close.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT OR IGNORE INTO seed_runs (seed_version,applied_at) VALUES ('content-2026-10-06-v1','2026-10-06T00:00:00Z');
