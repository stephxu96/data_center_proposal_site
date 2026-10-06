INSERT INTO countries (seed_key,name,region) VALUES ('US','United States','North America') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO countries (seed_key,name,region) VALUES ('CA','Canada','North America') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO countries (seed_key,name,region) VALUES ('FI','Finland','Europe') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO sites (seed_key,country_id,name,proxy_city,notes) VALUES ('tx',(SELECT id FROM countries WHERE seed_key='US'),'Texas','Dallas','Candidate metro; final parcel and utility connection require a site-specific offer.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO sites (seed_key,country_id,name,proxy_city,notes) VALUES ('qc',(SELECT id FROM countries WHERE seed_key='CA'),'Québec','Montréal','Candidate metro; final parcel and utility connection require a site-specific offer.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO sites (seed_key,country_id,name,proxy_city,notes) VALUES ('hel',(SELECT id FROM countries WHERE seed_key='FI'),'Helsinki','Helsinki','Candidate metro; final parcel and utility connection require a site-specific offer.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO demand_regions (seed_key,name,proxy_cities,addressable,notes) VALUES ('east','US East','New York / Washington / Boston',1,'Demand proxy, not signed member demand.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO demand_regions (seed_key,name,proxy_cities,addressable,notes) VALUES ('central','US Central + Canada/Mexico','Chicago',1,'Demand proxy, not signed member demand.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO demand_regions (seed_key,name,proxy_cities,addressable,notes) VALUES ('west','US West','San Francisco',1,'Demand proxy, not signed member demand.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO demand_regions (seed_key,name,proxy_cities,addressable,notes) VALUES ('europe','Europe','Frankfurt / London',1,'Demand proxy, not signed member demand.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO demand_regions (seed_key,name,proxy_cities,addressable,notes) VALUES ('asia','Asia-Pacific excluding China','Tokyo / Singapore',1,'Demand proxy, not signed member demand.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO demand_regions (seed_key,name,proxy_cities,addressable,notes) VALUES ('rest','Rest of world','Europe / Asia proxy',1,'Demand proxy, not signed member demand.') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO demand_regions (seed_key,name,proxy_cities,addressable,notes) VALUES ('china','China','Not addressable',0,'Excluded by consortium service-market design decision.') ON CONFLICT DO NOTHING;
