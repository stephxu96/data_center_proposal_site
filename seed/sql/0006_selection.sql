INSERT INTO criteria (code,kind,name,measure,rubric) VALUES ('K10','score','Proximity to demand: share of addressable AI demand within 50 ms round trip','Proximity to demand: share of addressable AI demand within 50 ms round trip','{"1":"< 15%","3":"30–45%","5":"≥ 60%"}') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criteria (code,kind,name,measure,rubric) VALUES ('K1','score','Time to obtain a grid connection','Time to obtain a grid connection','{"1":"Discretionary approval, competing for scarce power","3":"Restricted or queued, with a defined process","5":"Standard process, no capacity restriction"}') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criteria (code,kind,name,measure,rubric) VALUES ('K2','score','Electricity price, delivered','Electricity price, delivered','{"1":"> $95/MWh","3":"$65–80/MWh","5":"≤ $50/MWh"}') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criteria (code,kind,name,measure,rubric) VALUES ('K4','score','Grid reliability and extreme weather','Grid reliability and extreme weather','{"1":"Repeated large-scale failures","3":"Notable but mitigable events","5":"Very high reliability, low exposure"}') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criteria (code,kind,name,measure,rubric) VALUES ('K6','score','Research ecosystem and likely members','Research ecosystem and likely members','{"1":"Thin","3":"Moderate","5":"Dense, large AI research base"}') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criteria (code,kind,name,measure,rubric) VALUES ('K3','score','Grid carbon intensity','Grid carbon intensity','{"1":"> 450 g/kWh","3":"100–250 g/kWh","5":"< 25 g/kWh"}') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criteria (code,kind,name,measure,rubric) VALUES ('K5','score','Climate and water for cooling','Climate and water for cooling','{"1":"Hot, high water stress","3":"Moderate","5":"Cool, low water stress"}') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criteria (code,kind,name,measure,rubric) VALUES ('K7','score','Existing facilities to lease','Existing facilities to lease','{"1":"Little","3":"Some","5":"Large, accessible capacity"}') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criteria (code,kind,name,measure,rubric) VALUES ('K8','score','Permitting regime','Permitting regime','{"1":"Uncertain or hostile","3":"Clear but sequential, or under political review","5":"Clear, fast, politically stable"}') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criteria (code,kind,name,measure,rubric) VALUES ('K9','score','Waste-heat reuse','Waste-heat reuse','{"1":"None","3":"Networks exist, few examples","5":"Established market for buying data center heat"}') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criteria (code,kind,name,measure,rubric) VALUES ('K11','score','Data-transfer price per TB to users','Data-transfer price per TB to users','{"1":"—","3":"—","5":"—"}') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criteria (code,kind,name,measure,rubric) VALUES ('G1','gate','Grid connection legally and practically obtainable','Grid connection legally and practically obtainable','Conditional until site-specific due diligence closes.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criteria (code,kind,name,measure,rubric) VALUES ('G2','gate','No law prohibits the proposed facility','No law prohibits the proposed facility','Conditional until site-specific due diligence closes.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criteria (code,kind,name,measure,rubric) VALUES ('G3','gate','No unmitigable single hazard','No unmitigable single hazard','Conditional until site-specific due diligence closes.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criterion_weights (seed_key,criterion_code,weight,rationale,created_at) VALUES ('W-K10','K10',25,'Users are global and weighted by demand. Distance affects every interactive session and every dataset or saved-progress move.','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criterion_weights (seed_key,criterion_code,weight,rationale,created_at) VALUES ('W-K1','K1',15,'Sets the opening date; drives PS3 stress case A','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criterion_weights (seed_key,criterion_code,weight,rationale,created_at) VALUES ('W-K2','K2',15,'219 GWh/yr makes power the largest running cost','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criterion_weights (seed_key,criterion_code,weight,rationale,created_at) VALUES ('W-K4','K4',10,'Uptime target; PS3''s 48-hour outage case','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criterion_weights (seed_key,criterion_code,weight,rationale,created_at) VALUES ('W-K6','K6',10,'Anchor members and demand','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criterion_weights (seed_key,criterion_code,weight,rationale,created_at) VALUES ('W-K3','K3',5,'Reputation and emissions reporting','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criterion_weights (seed_key,criterion_code,weight,rationale,created_at) VALUES ('W-K5','K5',5,'Sets the achievable PUE and the water draw','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criterion_weights (seed_key,criterion_code,weight,rationale,created_at) VALUES ('W-K7','K7',5,'Enables a phased hybrid','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criterion_weights (seed_key,criterion_code,weight,rationale,created_at) VALUES ('W-K8','K8',5,'Schedule risk','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criterion_weights (seed_key,criterion_code,weight,rationale,created_at) VALUES ('W-K9','K9',5,'Operating credit; community benefit','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO criterion_weights (seed_key,criterion_code,weight,rationale,created_at) VALUES ('W-K11','K11',0,'Evaluated, but it does not separate the sites (§7.3)','2026-10-06T00:00:00Z') ON CONFLICT DO NOTHING;
