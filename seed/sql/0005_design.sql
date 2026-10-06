INSERT INTO teams (seed_key,name,course_section) VALUES ('university-demo-team','University AI infrastructure team',NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO designs (seed_key,team_id,name,selected_country_id,selected_site_id,design_summary,created_at,updated_at) VALUES ('university-design',(SELECT id FROM teams WHERE seed_key='university-demo-team'),'Shared university AI data center',(SELECT id FROM countries WHERE seed_key='US'),(SELECT id FROM sites WHERE seed_key='tx'),'Stage-gated hybrid; Texas reference location, conditional on utility and member commitments.','2026-10-06T00:00:00Z','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,created_at) VALUES ('P-it_load_mw',(SELECT id FROM designs WHERE seed_key='university-design'),'it_load_mw',20,'assumption','Baseline defined in the challenge brief and phase-one design specification.','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,created_at) VALUES ('P-pue',(SELECT id FROM designs WHERE seed_key='university-design'),'pue',1.25,'assumption','Baseline defined in the challenge brief and phase-one design specification.','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,created_at) VALUES ('P-operating_hours',(SELECT id FROM designs WHERE seed_key='university-design'),'operating_hours',8760,'assumption','Baseline defined in the challenge brief and phase-one design specification.','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO design_parameters (seed_key,design_id,name,value,claim_type,rationale,created_at) VALUES ('P-latency_threshold_ms',(SELECT id FROM designs WHERE seed_key='university-design'),'latency_threshold_ms',50,'assumption','Baseline defined in the challenge brief and phase-one design specification.','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO scenarios (seed_key,design_id,name,kind,description,created_at) VALUES ('base',(SELECT id FROM designs WHERE seed_key='university-design'),'Base case','base','Small delay assumption: 0.5 months.','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO scenarios (seed_key,design_id,name,kind,description,created_at) VALUES ('grid-delay',(SELECT id FROM designs WHERE seed_key='university-design'),'Three-month additional delay','variant','Sensitivity requested by the team.','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO scenarios (seed_key,design_id,name,kind,description,created_at) VALUES ('grid-year-delay',(SELECT id FROM designs WHERE seed_key='university-design'),'One-year grid delay','stress','Required challenge stress: full grid power delayed one year.','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO scenarios (seed_key,design_id,name,kind,description,created_at) VALUES ('half-utilization',(SELECT id FROM designs WHERE seed_key='university-design'),'Half forecast utilization','stress','Required challenge stress: utilization is half the base forecast.','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
