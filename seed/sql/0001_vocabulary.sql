INSERT INTO units (code,description) VALUES ('MW','MW') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('GW','GW') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('GWh','GWh') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('TWh','TWh') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('%','%') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('gCO2/kWh','gCO2/kWh') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('count','count') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('USD/MWh','USD/MWh') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('USD/TB','USD/TB') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('ms','ms') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('score','score') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('months','months') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('hours','hours') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('ratio','ratio') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('CDD','CDD') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('minutes','minutes') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('USD/CAD','USD/CAD') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO units (code,description) VALUES ('EUR/USD','EUR/USD') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('dc_electricity_use','dc electricity use','TWh','demand_region',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('dc_capacity_in_service','dc capacity in service','MW','country',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('datacenter_count','datacenter count','count','country',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('industrial_electricity_price','industrial electricity price','USD/MWh','site',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('wholesale_electricity_price','wholesale electricity price','USD/MWh','site',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('electricity_tax','electricity tax','USD/MWh','site',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('grid_carbon_intensity','grid carbon intensity','gCO2/kWh','site',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('cooling_degree_days','cooling degree days','CDD','site',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('share_hours_below_18c','share hours below 18c','%','site',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('water_stress_score','water stress score','score','site',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('avg_outage_minutes_per_customer','avg outage minutes per customer','minutes','site',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('r1_university_count','r1 university count','count','site',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('ai_research_faculty','ai research faculty','count','site',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('leasable_gpu_count','leasable gpu count','count','site',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('large_load_threshold_mw','large load threshold mw','MW','site',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('grid_connection_months','grid connection months','months','site',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('round_trip_latency','round trip latency','ms','site_to_region',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('data_transfer_price','data transfer price','USD/TB','site',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('fx_rate','fx rate','ratio','country',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES ('demand_share','demand share','%','demand_region',0,NULL) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('it_load_mw','it load mw','MW',0.1,2000,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('pue','pue','ratio',1,3,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('operating_hours','operating hours','hours',1,8760,1) ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES ('latency_threshold_ms','latency threshold ms','ms',0,1000,1) ON CONFLICT DO NOTHING;
