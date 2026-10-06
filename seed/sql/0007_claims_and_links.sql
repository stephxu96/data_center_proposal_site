INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('selection',(SELECT id FROM designs WHERE seed_key='university-design'),'Selected site: Texas, conditional on utility offers and signed member demand.','design_decision',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('china-excluded',(SELECT id FROM designs WHERE seed_key='university-design'),'China is excluded from the addressable service market for the consortium.','design_decision',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('assumption-it_load_mw',(SELECT id FROM designs WHERE seed_key='university-design'),'it load mw is a chosen baseline, not a facility measurement.','assumption',20,'MW',NULL,NULL,'draft','medium','design','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('assumption-pue',(SELECT id FROM designs WHERE seed_key='university-design'),'pue is a chosen baseline, not a facility measurement.','assumption',1.25,'ratio',NULL,NULL,'draft','medium','design','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('assumption-operating_hours',(SELECT id FROM designs WHERE seed_key='university-design'),'operating hours is a chosen baseline, not a facility measurement.','assumption',8760,'hours',NULL,NULL,'draft','medium','design','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('assumption-latency_threshold_ms',(SELECT id FROM designs WHERE seed_key='university-design'),'latency threshold ms is a chosen baseline, not a facility measurement.','assumption',50,'ms',NULL,NULL,'draft','medium','design','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('facility_power_mw',(SELECT id FROM designs WHERE seed_key='university-design'),'Facility electrical power','calculation',NULL,'MW','facility_power_mw',NULL,'draft','medium','power','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('annual_energy_gwh',(SELECT id FROM designs WHERE seed_key='university-design'),'Annual facility electricity','calculation',NULL,'GWh','annual_energy_gwh',NULL,'draft','medium','power','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-tx-K10',(SELECT id FROM designs WHERE seed_key='university-design'),'Texas: Proximity to demand: share of addressable AI demand within 50 ms round trip. Judgment score 5 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-tx-K1',(SELECT id FROM designs WHERE seed_key='university-design'),'Texas: Time to obtain a grid connection. Judgment score 4 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-tx-K2',(SELECT id FROM designs WHERE seed_key='university-design'),'Texas: Electricity price, delivered. Judgment score 3 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-tx-K4',(SELECT id FROM designs WHERE seed_key='university-design'),'Texas: Grid reliability and extreme weather. Judgment score 2 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-tx-K6',(SELECT id FROM designs WHERE seed_key='university-design'),'Texas: Research ecosystem and likely members. Judgment score 5 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-tx-K3',(SELECT id FROM designs WHERE seed_key='university-design'),'Texas: Grid carbon intensity. Judgment score 2 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-tx-K5',(SELECT id FROM designs WHERE seed_key='university-design'),'Texas: Climate and water for cooling. Judgment score 2 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-tx-K7',(SELECT id FROM designs WHERE seed_key='university-design'),'Texas: Existing facilities to lease. Judgment score 4 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-tx-K8',(SELECT id FROM designs WHERE seed_key='university-design'),'Texas: Permitting regime. Judgment score 3 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-tx-K9',(SELECT id FROM designs WHERE seed_key='university-design'),'Texas: Waste-heat reuse. Judgment score 1 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-tx-K11',(SELECT id FROM designs WHERE seed_key='university-design'),'Texas: Data-transfer price per TB to users. No differentiating score; weight is zero.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-tx-G1',(SELECT id FROM designs WHERE seed_key='university-design'),'Texas: G1 is conditional on site-specific legal, utility and resilience diligence.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-tx-G2',(SELECT id FROM designs WHERE seed_key='university-design'),'Texas: G2 is conditional on site-specific legal, utility and resilience diligence.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-tx-G3',(SELECT id FROM designs WHERE seed_key='university-design'),'Texas: G3 is conditional on site-specific legal, utility and resilience diligence.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('grid-tx',(SELECT id FROM designs WHERE seed_key='university-design'),'Texas: utility connection cost and energization date are not established; obtain a written offer.','unknown',NULL,NULL,NULL,NULL,'draft','medium','power','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-qc-K10',(SELECT id FROM designs WHERE seed_key='university-design'),'Québec: Proximity to demand: share of addressable AI demand within 50 ms round trip. Judgment score 4 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-qc-K1',(SELECT id FROM designs WHERE seed_key='university-design'),'Québec: Time to obtain a grid connection. Judgment score 1 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-qc-K2',(SELECT id FROM designs WHERE seed_key='university-design'),'Québec: Electricity price, delivered. Judgment score 2 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-qc-K4',(SELECT id FROM designs WHERE seed_key='university-design'),'Québec: Grid reliability and extreme weather. Judgment score 3 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-qc-K6',(SELECT id FROM designs WHERE seed_key='university-design'),'Québec: Research ecosystem and likely members. Judgment score 4 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-qc-K3',(SELECT id FROM designs WHERE seed_key='university-design'),'Québec: Grid carbon intensity. Judgment score 5 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-qc-K5',(SELECT id FROM designs WHERE seed_key='university-design'),'Québec: Climate and water for cooling. Judgment score 4 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-qc-K7',(SELECT id FROM designs WHERE seed_key='university-design'),'Québec: Existing facilities to lease. Judgment score 3 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-qc-K8',(SELECT id FROM designs WHERE seed_key='university-design'),'Québec: Permitting regime. Judgment score 3 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-qc-K9',(SELECT id FROM designs WHERE seed_key='university-design'),'Québec: Waste-heat reuse. Judgment score 3 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-qc-K11',(SELECT id FROM designs WHERE seed_key='university-design'),'Québec: Data-transfer price per TB to users. No differentiating score; weight is zero.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-qc-G1',(SELECT id FROM designs WHERE seed_key='university-design'),'Québec: G1 is conditional on site-specific legal, utility and resilience diligence.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-qc-G2',(SELECT id FROM designs WHERE seed_key='university-design'),'Québec: G2 is conditional on site-specific legal, utility and resilience diligence.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-qc-G3',(SELECT id FROM designs WHERE seed_key='university-design'),'Québec: G3 is conditional on site-specific legal, utility and resilience diligence.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('grid-qc',(SELECT id FROM designs WHERE seed_key='university-design'),'Québec: utility connection cost and energization date are not established; obtain a written offer.','unknown',NULL,NULL,NULL,NULL,'draft','medium','power','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-hel-K10',(SELECT id FROM designs WHERE seed_key='university-design'),'Helsinki: Proximity to demand: share of addressable AI demand within 50 ms round trip. Judgment score 2 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-hel-K1',(SELECT id FROM designs WHERE seed_key='university-design'),'Helsinki: Time to obtain a grid connection. Judgment score 2 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-hel-K2',(SELECT id FROM designs WHERE seed_key='university-design'),'Helsinki: Electricity price, delivered. Judgment score 3 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-hel-K4',(SELECT id FROM designs WHERE seed_key='university-design'),'Helsinki: Grid reliability and extreme weather. Judgment score 4 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-hel-K6',(SELECT id FROM designs WHERE seed_key='university-design'),'Helsinki: Research ecosystem and likely members. Judgment score 3 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-hel-K3',(SELECT id FROM designs WHERE seed_key='university-design'),'Helsinki: Grid carbon intensity. Judgment score 4 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-hel-K5',(SELECT id FROM designs WHERE seed_key='university-design'),'Helsinki: Climate and water for cooling. Judgment score 5 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-hel-K7',(SELECT id FROM designs WHERE seed_key='university-design'),'Helsinki: Existing facilities to lease. Judgment score 5 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-hel-K8',(SELECT id FROM designs WHERE seed_key='university-design'),'Helsinki: Permitting regime. Judgment score 3 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-hel-K9',(SELECT id FROM designs WHERE seed_key='university-design'),'Helsinki: Waste-heat reuse. Judgment score 5 on the phase-one rubric; subject to the cited conditions.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-hel-K11',(SELECT id FROM designs WHERE seed_key='university-design'),'Helsinki: Data-transfer price per TB to users. No differentiating score; weight is zero.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-hel-G1',(SELECT id FROM designs WHERE seed_key='university-design'),'Helsinki: G1 is conditional on site-specific legal, utility and resilience diligence.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-hel-G2',(SELECT id FROM designs WHERE seed_key='university-design'),'Helsinki: G2 is conditional on site-specific legal, utility and resilience diligence.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('A-hel-G3',(SELECT id FROM designs WHERE seed_key='university-design'),'Helsinki: G3 is conditional on site-specific legal, utility and resilience diligence.','estimate',NULL,NULL,NULL,NULL,'draft','medium','site_selection','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('grid-hel',(SELECT id FROM designs WHERE seed_key='university-design'),'Helsinki: utility connection cost and energization date are not established; obtain a written offer.','unknown',NULL,NULL,NULL,NULL,'draft','medium','power','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('currency-conversion',(SELECT id FROM designs WHERE seed_key='university-design'),'Converted site prices use the recorded period-specific currency assumptions.','assumption',NULL,NULL,NULL,NULL,'draft','medium','economics','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('condition-1',(SELECT id FROM designs WHERE seed_key='university-design'),'Obtain a written utility energization schedule and full connection cost.','unknown',NULL,NULL,NULL,NULL,'draft','medium','approval','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('condition-2',(SELECT id FROM designs WHERE seed_key='university-design'),'Confirm the applicable large-load rules and curtailment obligations before procurement.','unknown',NULL,NULL,NULL,NULL,'draft','medium','approval','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('condition-3',(SELECT id FROM designs WHERE seed_key='university-design'),'Complete a site-specific resilience and backup-power study.','unknown',NULL,NULL,NULL,NULL,'draft','medium','approval','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('condition-4',(SELECT id FROM designs WHERE seed_key='university-design'),'Use a closed-loop cooling design with no routine evaporative water demand.','unknown',NULL,NULL,NULL,NULL,'draft','medium','approval','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('condition-5',(SELECT id FROM designs WHERE seed_key='university-design'),'Secure an electricity and carbon procurement plan acceptable to the member institutions.','unknown',NULL,NULL,NULL,NULL,'draft','medium','approval','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('reversal-1',(SELECT id FROM designs WHERE seed_key='university-design'),'Québec confirms an earlier connection and a durable, competitive delivered power rate.','unknown',NULL,NULL,NULL,NULL,'draft','medium','reversal_trigger','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('reversal-2',(SELECT id FROM designs WHERE seed_key='university-design'),'Member demand shifts materially toward batch training rather than latency-sensitive use.','unknown',NULL,NULL,NULL,NULL,'draft','medium','reversal_trigger','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('reversal-3',(SELECT id FROM designs WHERE seed_key='university-design'),'The member survey places substantially more weight on East Coast proximity.','unknown',NULL,NULL,NULL,NULL,'draft','medium','reversal_trigger','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('reversal-4',(SELECT id FROM designs WHERE seed_key='university-design'),'Texas interconnection or large-load rules change the economics or operating flexibility.','unknown',NULL,NULL,NULL,NULL,'draft','medium','reversal_trigger','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_claims (seed_key,design_id,claim_text,claim_type,value,unit,calc_key,source_id,status,confidence,topic,created_at) VALUES ('member-demand',(SELECT id FROM designs WHERE seed_key='university-design'),'No institution has signed a long-term computing commitment; productive demand remains to be contracted.','fact',NULL,NULL,NULL,(SELECT id FROM sources WHERE seed_key='S63'),'draft','medium','governance','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-tx-K10','K10',(SELECT id FROM sites WHERE seed_key='tx'),5,NULL,(SELECT id FROM design_claims WHERE seed_key='A-tx-K10'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-tx-K1','K1',(SELECT id FROM sites WHERE seed_key='tx'),4,NULL,(SELECT id FROM design_claims WHERE seed_key='A-tx-K1'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-tx-K2','K2',(SELECT id FROM sites WHERE seed_key='tx'),3,NULL,(SELECT id FROM design_claims WHERE seed_key='A-tx-K2'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-tx-K4','K4',(SELECT id FROM sites WHERE seed_key='tx'),2,NULL,(SELECT id FROM design_claims WHERE seed_key='A-tx-K4'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-tx-K6','K6',(SELECT id FROM sites WHERE seed_key='tx'),5,NULL,(SELECT id FROM design_claims WHERE seed_key='A-tx-K6'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-tx-K3','K3',(SELECT id FROM sites WHERE seed_key='tx'),2,NULL,(SELECT id FROM design_claims WHERE seed_key='A-tx-K3'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-tx-K5','K5',(SELECT id FROM sites WHERE seed_key='tx'),2,NULL,(SELECT id FROM design_claims WHERE seed_key='A-tx-K5'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-tx-K7','K7',(SELECT id FROM sites WHERE seed_key='tx'),4,NULL,(SELECT id FROM design_claims WHERE seed_key='A-tx-K7'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-tx-K8','K8',(SELECT id FROM sites WHERE seed_key='tx'),3,NULL,(SELECT id FROM design_claims WHERE seed_key='A-tx-K8'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-tx-K9','K9',(SELECT id FROM sites WHERE seed_key='tx'),1,NULL,(SELECT id FROM design_claims WHERE seed_key='A-tx-K9'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-tx-K11','K11',(SELECT id FROM sites WHERE seed_key='tx'),NULL,NULL,(SELECT id FROM design_claims WHERE seed_key='A-tx-K11'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-tx-G1','G1',(SELECT id FROM sites WHERE seed_key='tx'),NULL,'conditional',(SELECT id FROM design_claims WHERE seed_key='A-tx-G1'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-tx-G2','G2',(SELECT id FROM sites WHERE seed_key='tx'),NULL,'conditional',(SELECT id FROM design_claims WHERE seed_key='A-tx-G2'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-tx-G3','G3',(SELECT id FROM sites WHERE seed_key='tx'),NULL,'conditional',(SELECT id FROM design_claims WHERE seed_key='A-tx-G3'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-qc-K10','K10',(SELECT id FROM sites WHERE seed_key='qc'),4,NULL,(SELECT id FROM design_claims WHERE seed_key='A-qc-K10'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-qc-K1','K1',(SELECT id FROM sites WHERE seed_key='qc'),1,NULL,(SELECT id FROM design_claims WHERE seed_key='A-qc-K1'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-qc-K2','K2',(SELECT id FROM sites WHERE seed_key='qc'),2,NULL,(SELECT id FROM design_claims WHERE seed_key='A-qc-K2'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-qc-K4','K4',(SELECT id FROM sites WHERE seed_key='qc'),3,NULL,(SELECT id FROM design_claims WHERE seed_key='A-qc-K4'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-qc-K6','K6',(SELECT id FROM sites WHERE seed_key='qc'),4,NULL,(SELECT id FROM design_claims WHERE seed_key='A-qc-K6'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-qc-K3','K3',(SELECT id FROM sites WHERE seed_key='qc'),5,NULL,(SELECT id FROM design_claims WHERE seed_key='A-qc-K3'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-qc-K5','K5',(SELECT id FROM sites WHERE seed_key='qc'),4,NULL,(SELECT id FROM design_claims WHERE seed_key='A-qc-K5'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-qc-K7','K7',(SELECT id FROM sites WHERE seed_key='qc'),3,NULL,(SELECT id FROM design_claims WHERE seed_key='A-qc-K7'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-qc-K8','K8',(SELECT id FROM sites WHERE seed_key='qc'),3,NULL,(SELECT id FROM design_claims WHERE seed_key='A-qc-K8'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-qc-K9','K9',(SELECT id FROM sites WHERE seed_key='qc'),3,NULL,(SELECT id FROM design_claims WHERE seed_key='A-qc-K9'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-qc-K11','K11',(SELECT id FROM sites WHERE seed_key='qc'),NULL,NULL,(SELECT id FROM design_claims WHERE seed_key='A-qc-K11'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-qc-G1','G1',(SELECT id FROM sites WHERE seed_key='qc'),NULL,'conditional',(SELECT id FROM design_claims WHERE seed_key='A-qc-G1'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-qc-G2','G2',(SELECT id FROM sites WHERE seed_key='qc'),NULL,'conditional',(SELECT id FROM design_claims WHERE seed_key='A-qc-G2'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-qc-G3','G3',(SELECT id FROM sites WHERE seed_key='qc'),NULL,'conditional',(SELECT id FROM design_claims WHERE seed_key='A-qc-G3'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-hel-K10','K10',(SELECT id FROM sites WHERE seed_key='hel'),2,NULL,(SELECT id FROM design_claims WHERE seed_key='A-hel-K10'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-hel-K1','K1',(SELECT id FROM sites WHERE seed_key='hel'),2,NULL,(SELECT id FROM design_claims WHERE seed_key='A-hel-K1'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-hel-K2','K2',(SELECT id FROM sites WHERE seed_key='hel'),3,NULL,(SELECT id FROM design_claims WHERE seed_key='A-hel-K2'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-hel-K4','K4',(SELECT id FROM sites WHERE seed_key='hel'),4,NULL,(SELECT id FROM design_claims WHERE seed_key='A-hel-K4'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-hel-K6','K6',(SELECT id FROM sites WHERE seed_key='hel'),3,NULL,(SELECT id FROM design_claims WHERE seed_key='A-hel-K6'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-hel-K3','K3',(SELECT id FROM sites WHERE seed_key='hel'),4,NULL,(SELECT id FROM design_claims WHERE seed_key='A-hel-K3'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-hel-K5','K5',(SELECT id FROM sites WHERE seed_key='hel'),5,NULL,(SELECT id FROM design_claims WHERE seed_key='A-hel-K5'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-hel-K7','K7',(SELECT id FROM sites WHERE seed_key='hel'),5,NULL,(SELECT id FROM design_claims WHERE seed_key='A-hel-K7'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-hel-K8','K8',(SELECT id FROM sites WHERE seed_key='hel'),3,NULL,(SELECT id FROM design_claims WHERE seed_key='A-hel-K8'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-hel-K9','K9',(SELECT id FROM sites WHERE seed_key='hel'),5,NULL,(SELECT id FROM design_claims WHERE seed_key='A-hel-K9'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-hel-K11','K11',(SELECT id FROM sites WHERE seed_key='hel'),NULL,NULL,(SELECT id FROM design_claims WHERE seed_key='A-hel-K11'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-hel-G1','G1',(SELECT id FROM sites WHERE seed_key='hel'),NULL,'conditional',(SELECT id FROM design_claims WHERE seed_key='A-hel-G1'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-hel-G2','G2',(SELECT id FROM sites WHERE seed_key='hel'),NULL,'conditional',(SELECT id FROM design_claims WHERE seed_key='A-hel-G2'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO site_assessments (seed_key,criterion_code,site_id,score,gate_result,claim_id,created_at) VALUES ('A-hel-G3','G3',(SELECT id FROM sites WHERE seed_key='hel'),NULL,'conditional',(SELECT id FROM design_claims WHERE seed_key='A-hel-G3'),'2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-china-excluded-sources-S61',(SELECT id FROM design_claims WHERE seed_key='china-excluded'),'evidence',(SELECT id FROM sources WHERE seed_key='S61')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('L-assumption-it_load_mw-parameter_definitions-it_load_mw',(SELECT id FROM design_claims WHERE seed_key='assumption-it_load_mw'),'input','it_load_mw') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('L-assumption-pue-parameter_definitions-pue',(SELECT id FROM design_claims WHERE seed_key='assumption-pue'),'input','pue') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('L-assumption-operating_hours-parameter_definitions-operating_hours',(SELECT id FROM design_claims WHERE seed_key='assumption-operating_hours'),'input','operating_hours') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('L-assumption-latency_threshold_ms-parameter_definitions-latency_threshold_ms',(SELECT id FROM design_claims WHERE seed_key='assumption-latency_threshold_ms'),'input','latency_threshold_ms') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('L-facility_power_mw-parameter_definitions-it_load_mw',(SELECT id FROM design_claims WHERE seed_key='facility_power_mw'),'input','it_load_mw') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('L-facility_power_mw-parameter_definitions-pue',(SELECT id FROM design_claims WHERE seed_key='facility_power_mw'),'input','pue') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('L-annual_energy_gwh-parameter_definitions-it_load_mw',(SELECT id FROM design_claims WHERE seed_key='annual_energy_gwh'),'input','it_load_mw') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('L-annual_energy_gwh-parameter_definitions-pue',(SELECT id FROM design_claims WHERE seed_key='annual_energy_gwh'),'input','pue') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,parameter_name) VALUES ('L-annual_energy_gwh-parameter_definitions-operating_hours',(SELECT id FROM design_claims WHERE seed_key='annual_energy_gwh'),'input','operating_hours') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K10-sources-S51',(SELECT id FROM design_claims WHERE seed_key='A-tx-K10'),'evidence',(SELECT id FROM sources WHERE seed_key='S51')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K10-sources-S57',(SELECT id FROM design_claims WHERE seed_key='A-tx-K10'),'evidence',(SELECT id FROM sources WHERE seed_key='S57')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-tx-K10',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-tx-K10')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K1-sources-S2',(SELECT id FROM design_claims WHERE seed_key='A-tx-K1'),'evidence',(SELECT id FROM sources WHERE seed_key='S2')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K1-sources-S4',(SELECT id FROM design_claims WHERE seed_key='A-tx-K1'),'evidence',(SELECT id FROM sources WHERE seed_key='S4')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-tx-K1',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-tx-K1')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K2-sources-S5',(SELECT id FROM design_claims WHERE seed_key='A-tx-K2'),'evidence',(SELECT id FROM sources WHERE seed_key='S5')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K2-sources-S6',(SELECT id FROM design_claims WHERE seed_key='A-tx-K2'),'evidence',(SELECT id FROM sources WHERE seed_key='S6')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-tx-K2',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-tx-K2')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K4-sources-S8',(SELECT id FROM design_claims WHERE seed_key='A-tx-K4'),'evidence',(SELECT id FROM sources WHERE seed_key='S8')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K4-sources-S9',(SELECT id FROM design_claims WHERE seed_key='A-tx-K4'),'evidence',(SELECT id FROM sources WHERE seed_key='S9')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-tx-K4',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-tx-K4')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K6-sources-S11',(SELECT id FROM design_claims WHERE seed_key='A-tx-K6'),'evidence',(SELECT id FROM sources WHERE seed_key='S11')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-tx-K6',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-tx-K6')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K3-sources-S7',(SELECT id FROM design_claims WHERE seed_key='A-tx-K3'),'evidence',(SELECT id FROM sources WHERE seed_key='S7')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-tx-K3',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-tx-K3')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K5-sources-S10',(SELECT id FROM design_claims WHERE seed_key='A-tx-K5'),'evidence',(SELECT id FROM sources WHERE seed_key='S10')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K5-sources-S44',(SELECT id FROM design_claims WHERE seed_key='A-tx-K5'),'evidence',(SELECT id FROM sources WHERE seed_key='S44')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-tx-K5',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-tx-K5')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K7-sources-S36',(SELECT id FROM design_claims WHERE seed_key='A-tx-K7'),'evidence',(SELECT id FROM sources WHERE seed_key='S36')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-tx-K7',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-tx-K7')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K8-sources-S43',(SELECT id FROM design_claims WHERE seed_key='A-tx-K8'),'evidence',(SELECT id FROM sources WHERE seed_key='S43')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K8-sources-S44',(SELECT id FROM design_claims WHERE seed_key='A-tx-K8'),'evidence',(SELECT id FROM sources WHERE seed_key='S44')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-tx-K8',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-tx-K8')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K9-sources-S49',(SELECT id FROM design_claims WHERE seed_key='A-tx-K9'),'evidence',(SELECT id FROM sources WHERE seed_key='S49')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-tx-K9',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-tx-K9')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K11-sources-S58',(SELECT id FROM design_claims WHERE seed_key='A-tx-K11'),'evidence',(SELECT id FROM sources WHERE seed_key='S58')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-K11-sources-S60',(SELECT id FROM design_claims WHERE seed_key='A-tx-K11'),'evidence',(SELECT id FROM sources WHERE seed_key='S60')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-tx-K11',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-tx-K11')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-G1-sources-S2',(SELECT id FROM design_claims WHERE seed_key='A-tx-G1'),'evidence',(SELECT id FROM sources WHERE seed_key='S2')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-tx-G1',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-tx-G1')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-G2-sources-S2',(SELECT id FROM design_claims WHERE seed_key='A-tx-G2'),'evidence',(SELECT id FROM sources WHERE seed_key='S2')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-tx-G2',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-tx-G2')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-tx-G3-sources-S2',(SELECT id FROM design_claims WHERE seed_key='A-tx-G3'),'evidence',(SELECT id FROM sources WHERE seed_key='S2')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-tx-G3',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-tx-G3')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K10-sources-S51',(SELECT id FROM design_claims WHERE seed_key='A-qc-K10'),'evidence',(SELECT id FROM sources WHERE seed_key='S51')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K10-sources-S57',(SELECT id FROM design_claims WHERE seed_key='A-qc-K10'),'evidence',(SELECT id FROM sources WHERE seed_key='S57')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-qc-K10',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-qc-K10')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K1-sources-S12',(SELECT id FROM design_claims WHERE seed_key='A-qc-K1'),'evidence',(SELECT id FROM sources WHERE seed_key='S12')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K1-sources-S14',(SELECT id FROM design_claims WHERE seed_key='A-qc-K1'),'evidence',(SELECT id FROM sources WHERE seed_key='S14')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-qc-K1',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-qc-K1')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K2-sources-S15',(SELECT id FROM design_claims WHERE seed_key='A-qc-K2'),'evidence',(SELECT id FROM sources WHERE seed_key='S15')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K2-sources-S16',(SELECT id FROM design_claims WHERE seed_key='A-qc-K2'),'evidence',(SELECT id FROM sources WHERE seed_key='S16')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-qc-K2',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-qc-K2')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K4-sources-S20',(SELECT id FROM design_claims WHERE seed_key='A-qc-K4'),'evidence',(SELECT id FROM sources WHERE seed_key='S20')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K4-sources-S21',(SELECT id FROM design_claims WHERE seed_key='A-qc-K4'),'evidence',(SELECT id FROM sources WHERE seed_key='S21')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-qc-K4',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-qc-K4')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K6-sources-S34',(SELECT id FROM design_claims WHERE seed_key='A-qc-K6'),'evidence',(SELECT id FROM sources WHERE seed_key='S34')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-qc-K6',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-qc-K6')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K3-sources-S18',(SELECT id FROM design_claims WHERE seed_key='A-qc-K3'),'evidence',(SELECT id FROM sources WHERE seed_key='S18')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-qc-K3',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-qc-K3')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K5-sources-S22',(SELECT id FROM design_claims WHERE seed_key='A-qc-K5'),'evidence',(SELECT id FROM sources WHERE seed_key='S22')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K5-sources-S23',(SELECT id FROM design_claims WHERE seed_key='A-qc-K5'),'evidence',(SELECT id FROM sources WHERE seed_key='S23')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-qc-K5',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-qc-K5')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K7-sources-S38',(SELECT id FROM design_claims WHERE seed_key='A-qc-K7'),'evidence',(SELECT id FROM sources WHERE seed_key='S38')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K7-sources-S39',(SELECT id FROM design_claims WHERE seed_key='A-qc-K7'),'evidence',(SELECT id FROM sources WHERE seed_key='S39')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-qc-K7',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-qc-K7')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K8-sources-S45',(SELECT id FROM design_claims WHERE seed_key='A-qc-K8'),'evidence',(SELECT id FROM sources WHERE seed_key='S45')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-qc-K8',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-qc-K8')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K9-sources-S48',(SELECT id FROM design_claims WHERE seed_key='A-qc-K9'),'evidence',(SELECT id FROM sources WHERE seed_key='S48')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-qc-K9',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-qc-K9')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K11-sources-S58',(SELECT id FROM design_claims WHERE seed_key='A-qc-K11'),'evidence',(SELECT id FROM sources WHERE seed_key='S58')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-K11-sources-S60',(SELECT id FROM design_claims WHERE seed_key='A-qc-K11'),'evidence',(SELECT id FROM sources WHERE seed_key='S60')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-qc-K11',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-qc-K11')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-G1-sources-S12',(SELECT id FROM design_claims WHERE seed_key='A-qc-G1'),'evidence',(SELECT id FROM sources WHERE seed_key='S12')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-qc-G1',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-qc-G1')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-G2-sources-S12',(SELECT id FROM design_claims WHERE seed_key='A-qc-G2'),'evidence',(SELECT id FROM sources WHERE seed_key='S12')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-qc-G2',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-qc-G2')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-qc-G3-sources-S12',(SELECT id FROM design_claims WHERE seed_key='A-qc-G3'),'evidence',(SELECT id FROM sources WHERE seed_key='S12')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-qc-G3',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-qc-G3')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K10-sources-S51',(SELECT id FROM design_claims WHERE seed_key='A-hel-K10'),'evidence',(SELECT id FROM sources WHERE seed_key='S51')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K10-sources-S57',(SELECT id FROM design_claims WHERE seed_key='A-hel-K10'),'evidence',(SELECT id FROM sources WHERE seed_key='S57')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-hel-K10',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-hel-K10')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K1-sources-S24',(SELECT id FROM design_claims WHERE seed_key='A-hel-K1'),'evidence',(SELECT id FROM sources WHERE seed_key='S24')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K1-sources-S25',(SELECT id FROM design_claims WHERE seed_key='A-hel-K1'),'evidence',(SELECT id FROM sources WHERE seed_key='S25')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-hel-K1',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-hel-K1')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K2-sources-S27',(SELECT id FROM design_claims WHERE seed_key='A-hel-K2'),'evidence',(SELECT id FROM sources WHERE seed_key='S27')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K2-sources-S28',(SELECT id FROM design_claims WHERE seed_key='A-hel-K2'),'evidence',(SELECT id FROM sources WHERE seed_key='S28')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-hel-K2',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-hel-K2')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K4-sources-S26',(SELECT id FROM design_claims WHERE seed_key='A-hel-K4'),'evidence',(SELECT id FROM sources WHERE seed_key='S26')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K4-sources-S31',(SELECT id FROM design_claims WHERE seed_key='A-hel-K4'),'evidence',(SELECT id FROM sources WHERE seed_key='S31')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-hel-K4',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-hel-K4')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K6-sources-S35',(SELECT id FROM design_claims WHERE seed_key='A-hel-K6'),'evidence',(SELECT id FROM sources WHERE seed_key='S35')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-hel-K6',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-hel-K6')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K3-sources-S30',(SELECT id FROM design_claims WHERE seed_key='A-hel-K3'),'evidence',(SELECT id FROM sources WHERE seed_key='S30')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-hel-K3',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-hel-K3')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K5-sources-S32',(SELECT id FROM design_claims WHERE seed_key='A-hel-K5'),'evidence',(SELECT id FROM sources WHERE seed_key='S32')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K5-sources-S33',(SELECT id FROM design_claims WHERE seed_key='A-hel-K5'),'evidence',(SELECT id FROM sources WHERE seed_key='S33')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-hel-K5',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-hel-K5')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K7-sources-S40',(SELECT id FROM design_claims WHERE seed_key='A-hel-K7'),'evidence',(SELECT id FROM sources WHERE seed_key='S40')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K7-sources-S41',(SELECT id FROM design_claims WHERE seed_key='A-hel-K7'),'evidence',(SELECT id FROM sources WHERE seed_key='S41')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-hel-K7',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-hel-K7')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K8-sources-S46',(SELECT id FROM design_claims WHERE seed_key='A-hel-K8'),'evidence',(SELECT id FROM sources WHERE seed_key='S46')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K8-sources-S47',(SELECT id FROM design_claims WHERE seed_key='A-hel-K8'),'evidence',(SELECT id FROM sources WHERE seed_key='S47')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-hel-K8',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-hel-K8')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K9-sources-S49',(SELECT id FROM design_claims WHERE seed_key='A-hel-K9'),'evidence',(SELECT id FROM sources WHERE seed_key='S49')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K9-sources-S50',(SELECT id FROM design_claims WHERE seed_key='A-hel-K9'),'evidence',(SELECT id FROM sources WHERE seed_key='S50')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-hel-K9',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-hel-K9')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K11-sources-S58',(SELECT id FROM design_claims WHERE seed_key='A-hel-K11'),'evidence',(SELECT id FROM sources WHERE seed_key='S58')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-K11-sources-S60',(SELECT id FROM design_claims WHERE seed_key='A-hel-K11'),'evidence',(SELECT id FROM sources WHERE seed_key='S60')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-hel-K11',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-hel-K11')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-G1-sources-S24',(SELECT id FROM design_claims WHERE seed_key='A-hel-G1'),'evidence',(SELECT id FROM sources WHERE seed_key='S24')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-hel-G1',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-hel-G1')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-G2-sources-S24',(SELECT id FROM design_claims WHERE seed_key='A-hel-G2'),'evidence',(SELECT id FROM sources WHERE seed_key='S24')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-hel-G2',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-hel-G2')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-A-hel-G3-sources-S24',(SELECT id FROM design_claims WHERE seed_key='A-hel-G3'),'evidence',(SELECT id FROM sources WHERE seed_key='S24')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,input_claim_id) VALUES ('L-selection-design_claims-A-hel-G3',(SELECT id FROM design_claims WHERE seed_key='selection'),'input',(SELECT id FROM design_claims WHERE seed_key='A-hel-G3')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,metric_id) VALUES ('L-currency-conversion-metrics-M-FX-CAD-USD',(SELECT id FROM design_claims WHERE seed_key='currency-conversion'),'input',(SELECT id FROM metrics WHERE seed_key='M-FX-CAD-USD')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,metric_id) VALUES ('L-currency-conversion-metrics-M-FX-EUR-USD',(SELECT id FROM design_claims WHERE seed_key='currency-conversion'),'input',(SELECT id FROM metrics WHERE seed_key='M-FX-EUR-USD')) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO claim_links (seed_key,claim_id,link_role,source_id) VALUES ('L-member-demand-sources-S63',(SELECT id FROM design_claims WHERE seed_key='member-demand'),'evidence',(SELECT id FROM sources WHERE seed_key='S63')) ON CONFLICT DO NOTHING;
