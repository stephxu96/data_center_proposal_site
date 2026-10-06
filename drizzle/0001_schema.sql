-- Phase 2 schema. Drizzle-generated tables followed by reviewed constraints,
-- append-only triggers, and current-value views.
CREATE TABLE `ai_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` text NOT NULL,
	`status` text NOT NULL,
	`model` text,
	`input_tokens` integer,
	`output_tokens` integer,
	`cited_source_ids` text,
	`removed_citation_count` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CHECK (`status` IN ('answered','refused','rate_limited','error')),
	CHECK (`input_tokens` IS NULL OR `input_tokens` >= 0),
	CHECK (`output_tokens` IS NULL OR `output_tokens` >= 0)
);
--> statement-breakpoint
CREATE INDEX `idx_ai_user_time` ON `ai_requests` (`user_id`,`created_at`);
--> statement-breakpoint
CREATE TABLE `claim_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`claim_id` integer NOT NULL,
	`link_role` text NOT NULL,
	`source_id` integer,
	`input_claim_id` integer,
	`metric_id` integer,
	`parameter_name` text,
	FOREIGN KEY (`claim_id`) REFERENCES `design_claims`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`input_claim_id`) REFERENCES `design_claims`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`metric_id`) REFERENCES `metrics`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`parameter_name`) REFERENCES `parameter_definitions`(`name`) ON UPDATE no action ON DELETE no action
	,CHECK (`link_role` IN ('evidence','input','context')),
	CHECK ((`source_id` IS NOT NULL) + (`input_claim_id` IS NOT NULL) + (`metric_id` IS NOT NULL) + (`parameter_name` IS NOT NULL) = 1),
	CHECK (`input_claim_id` IS NULL OR `input_claim_id` <> `claim_id`)
);
--> statement-breakpoint
CREATE INDEX `idx_links_claim` ON `claim_links` (`claim_id`);
--> statement-breakpoint
CREATE TABLE `committee_decisions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`design_id` integer NOT NULL,
	`round` integer NOT NULL,
	`outcome` text NOT NULL,
	`reason` text NOT NULL,
	`recorded_by` integer NOT NULL,
	`recorded_at` text NOT NULL,
	FOREIGN KEY (`design_id`) REFERENCES `designs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CHECK (`round` >= 1),
	CHECK (`outcome` IN ('approve','reject','send_back')),
	CHECK (length(`reason`) >= 20)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `committee_decisions_design_round` ON `committee_decisions` (`design_id`,`round`);
--> statement-breakpoint
CREATE TABLE `countries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`region` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `countries_name_unique` ON `countries` (`name`);
--> statement-breakpoint
CREATE TABLE `criteria` (
	`code` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`measure` text NOT NULL,
	`rubric` text NOT NULL,
	CHECK (`kind` IN ('gate','score'))
);
--> statement-breakpoint
CREATE TABLE `criterion_weights` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`criterion_code` text NOT NULL,
	`weight` real NOT NULL,
	`rationale` text NOT NULL,
	`created_at` text NOT NULL,
	`created_by` integer,
	FOREIGN KEY (`criterion_code`) REFERENCES `criteria`(`code`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CHECK (`weight` >= 0)
);
--> statement-breakpoint
CREATE TABLE `demand_regions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`proxy_cities` text NOT NULL,
	`addressable` integer DEFAULT 1 NOT NULL,
	`notes` text,
	CHECK (`addressable` IN (0,1))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `demand_regions_name_unique` ON `demand_regions` (`name`);
--> statement-breakpoint
CREATE TABLE `design_claims` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`design_id` integer NOT NULL,
	`claim_text` text NOT NULL,
	`claim_type` text NOT NULL,
	`value` real,
	`unit` text,
	`calc_key` text,
	`source_id` integer,
	`status` text NOT NULL,
	`confidence` text,
	`topic` text NOT NULL,
	`supersedes_claim_id` integer,
	`created_at` text NOT NULL,
	`created_by` integer,
	FOREIGN KEY (`design_id`) REFERENCES `designs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`unit`) REFERENCES `units`(`code`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supersedes_claim_id`) REFERENCES `design_claims`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CHECK (`claim_type` IN ('fact','estimate','assumption','calculation','design_decision','unknown')),
	CHECK (`status` IN ('draft','verified','disputed')),
	CHECK (`confidence` IS NULL OR `confidence` IN ('high','medium','low')),
	CHECK ((`claim_type` = 'calculation') = (`calc_key` IS NOT NULL)),
	CHECK (`claim_type` <> 'calculation' OR `value` IS NULL),
	CHECK (`claim_type` <> 'unknown' OR `value` IS NULL),
	CHECK (`claim_type` <> 'fact' OR `source_id` IS NOT NULL),
	CHECK (`value` IS NULL OR `unit` IS NOT NULL)
);
--> statement-breakpoint
CREATE INDEX `idx_claims` ON `design_claims` (`design_id`,`claim_type`,`topic`);
--> statement-breakpoint
CREATE TABLE `design_parameters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`design_id` integer NOT NULL,
	`name` text NOT NULL,
	`value` real NOT NULL,
	`claim_type` text NOT NULL,
	`rationale` text NOT NULL,
	`source_id` integer,
	`created_at` text NOT NULL,
	`created_by` integer,
	FOREIGN KEY (`design_id`) REFERENCES `designs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`name`) REFERENCES `parameter_definitions`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CHECK (`claim_type` IN ('assumption','estimate','fact')),
	CHECK (`claim_type` <> 'fact' OR `source_id` IS NOT NULL)
);
--> statement-breakpoint
CREATE INDEX `idx_params` ON `design_parameters` (`design_id`,`name`,`created_at`);
--> statement-breakpoint
CREATE TABLE `designs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`team_id` integer NOT NULL,
	`name` text NOT NULL,
	`selected_country_id` integer,
	`selected_site_id` integer,
	`design_summary` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`selected_country_id`) REFERENCES `countries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`selected_site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `designs_team_id_unique` ON `designs` (`team_id`);
--> statement-breakpoint
CREATE TABLE `evidence_requirements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`design_id` integer NOT NULL,
	`stage` text NOT NULL,
	`requirement_text` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` text NOT NULL,
	`created_by` integer,
	FOREIGN KEY (`design_id`) REFERENCES `designs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CHECK (`stage` IN ('development_equity','construction_debt','equipment_financing'))
);
--> statement-breakpoint
CREATE INDEX `idx_requirements` ON `evidence_requirements` (`design_id`,`stage`);
--> statement-breakpoint
CREATE TABLE `metric_definitions` (
	`name` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`unit` text NOT NULL,
	`subject` text NOT NULL,
	`min_value` real,
	`max_value` real,
	FOREIGN KEY (`unit`) REFERENCES `units`(`code`) ON UPDATE no action ON DELETE no action,
	CHECK (`subject` IN ('country','site','demand_region','site_to_region'))
);
--> statement-breakpoint
CREATE TABLE `metrics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`country_id` integer,
	`site_id` integer,
	`demand_region_id` integer,
	`metric_name` text NOT NULL,
	`value` real,
	`unit` text NOT NULL,
	`reporting_period` text,
	`claim_type` text DEFAULT 'fact' NOT NULL,
	`source_id` integer NOT NULL,
	`refresh_run_id` integer,
	`retrieved_at` text NOT NULL,
	`confidence` text NOT NULL,
	`notes` text,
	`entered_by` integer,
	FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`demand_region_id`) REFERENCES `demand_regions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`metric_name`) REFERENCES `metric_definitions`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`unit`) REFERENCES `units`(`code`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`refresh_run_id`) REFERENCES `refresh_runs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entered_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CHECK (`claim_type` IN ('fact','estimate')),
	CHECK (`confidence` IN ('high','medium','low')),
	CHECK (`country_id` IS NOT NULL OR `site_id` IS NOT NULL OR `demand_region_id` IS NOT NULL),
	CHECK (`value` IS NOT NULL OR `notes` IS NOT NULL),
	CHECK (`value` IS NULL OR `value` <> 0 OR `notes` IS NOT NULL)
);
--> statement-breakpoint
CREATE INDEX `idx_metrics_country` ON `metrics` (`country_id`,`metric_name`,`retrieved_at`);
--> statement-breakpoint
CREATE INDEX `idx_metrics_site` ON `metrics` (`site_id`,`metric_name`,`retrieved_at`);
--> statement-breakpoint
CREATE INDEX `idx_metrics_site_region` ON `metrics` (`site_id`,`demand_region_id`,`metric_name`,`retrieved_at`);
--> statement-breakpoint
CREATE TABLE `narrative_steps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`narrative_id` integer NOT NULL,
	`step_no` integer NOT NULL,
	`step_text` text NOT NULL,
	FOREIGN KEY (`narrative_id`) REFERENCES `narratives`(`id`) ON UPDATE no action ON DELETE no action,
	CHECK (`step_no` >= 1)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `narrative_steps_narrative_step` ON `narrative_steps` (`narrative_id`,`step_no`);
--> statement-breakpoint
CREATE TABLE `narratives` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`design_id` integer NOT NULL,
	`kind` text NOT NULL,
	`key` text NOT NULL,
	`version` integer NOT NULL,
	`title` text NOT NULL,
	`created_at` text NOT NULL,
	`created_by` integer,
	FOREIGN KEY (`design_id`) REFERENCES `designs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CHECK (`kind` IN ('failure_walkthrough','grid_impact','access_policy')),
	CHECK (`version` >= 1)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `narratives_design_key_version` ON `narratives` (`design_id`,`key`,`version`);
--> statement-breakpoint
CREATE INDEX `idx_narratives` ON `narratives` (`design_id`,`key`,`version`);
--> statement-breakpoint
CREATE TABLE `parameter_definitions` (
	`name` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`unit` text NOT NULL,
	`min_value` real,
	`max_value` real,
	`user_adjustable` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`unit`) REFERENCES `units`(`code`) ON UPDATE no action ON DELETE no action,
	CHECK (`user_adjustable` IN (0,1))
);
--> statement-breakpoint
CREATE TABLE `refresh_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_key` text NOT NULL,
	`started_at` text NOT NULL,
	`finished_at` text NOT NULL,
	`status` text NOT NULL,
	`rows_added` integer DEFAULT 0 NOT NULL,
	`error` text,
	`triggered_by` integer,
	FOREIGN KEY (`triggered_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CHECK (`status` IN ('ok','partial','failed')),
	CHECK (`rows_added` >= 0),
	CHECK (`status` = 'ok' OR `error` IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE `requirement_claims` (
	`requirement_id` integer NOT NULL,
	`claim_id` integer NOT NULL,
	FOREIGN KEY (`requirement_id`) REFERENCES `evidence_requirements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`claim_id`) REFERENCES `design_claims`(`id`) ON UPDATE no action ON DELETE no action,
	PRIMARY KEY (`requirement_id`,`claim_id`)
);
--> statement-breakpoint
CREATE TABLE `scenario_overrides` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`scenario_id` integer NOT NULL,
	`parameter_name` text NOT NULL,
	`value` real NOT NULL,
	`rationale` text NOT NULL,
	`created_at` text NOT NULL,
	`created_by` integer,
	FOREIGN KEY (`scenario_id`) REFERENCES `scenarios`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`parameter_name`) REFERENCES `parameter_definitions`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_overrides` ON `scenario_overrides` (`scenario_id`,`parameter_name`,`created_at`);
--> statement-breakpoint
CREATE TABLE `scenarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`design_id` integer NOT NULL,
	`name` text NOT NULL,
	`kind` text NOT NULL,
	`description` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`design_id`) REFERENCES `designs`(`id`) ON UPDATE no action ON DELETE no action,
	CHECK (`kind` IN ('base','stress','variant'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `scenarios_design_name` ON `scenarios` (`design_id`,`name`);
--> statement-breakpoint
CREATE TABLE `seed_runs` (
	`seed_version` text PRIMARY KEY NOT NULL,
	`applied_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`criterion_code` text NOT NULL,
	`site_id` integer NOT NULL,
	`score` integer,
	`gate_result` text,
	`claim_id` integer NOT NULL,
	`created_at` text NOT NULL,
	`created_by` integer,
	FOREIGN KEY (`criterion_code`) REFERENCES `criteria`(`code`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`claim_id`) REFERENCES `design_claims`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CHECK (`score` IS NULL OR `score` BETWEEN 1 AND 5),
	CHECK (`gate_result` IS NULL OR `gate_result` IN ('pass','conditional','fail')),
	CHECK (NOT (`score` IS NOT NULL AND `gate_result` IS NOT NULL))
);
--> statement-breakpoint
CREATE INDEX `idx_assess` ON `site_assessments` (`site_id`,`criterion_code`,`created_at`);
--> statement-breakpoint
CREATE TABLE `sites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`country_id` integer NOT NULL,
	`name` text NOT NULL,
	`proxy_city` text NOT NULL,
	`notes` text,
	FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sites_name_unique` ON `sites` (`name`);
--> statement-breakpoint
CREATE TABLE `sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`publisher` text NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`source_type` text NOT NULL,
	`is_primary` integer NOT NULL,
	`publication_date` text,
	`accessed_at` text NOT NULL,
	`excerpt` text,
	`notes` text,
	`supersedes_source_id` integer,
	FOREIGN KEY (`supersedes_source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE no action,
	CHECK (`source_type` IN ('government','regulator','grid_operator','statistics_agency','international_agency','company','academic','research_firm','press','law_firm','api','course_material')),
	CHECK (`is_primary` IN (0,1))
);
--> statement-breakpoint
CREATE TABLE `step_claims` (
	`step_id` integer NOT NULL,
	`claim_id` integer NOT NULL,
	FOREIGN KEY (`step_id`) REFERENCES `narrative_steps`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`claim_id`) REFERENCES `design_claims`(`id`) ON UPDATE no action ON DELETE no action,
	PRIMARY KEY (`step_id`,`claim_id`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`course_section` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teams_name_unique` ON `teams` (`name`);
--> statement-breakpoint
CREATE TABLE `units` (
	`code` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`authenticated_user_id` text NOT NULL,
	`email` text,
	`team_id` integer,
	`role` text DEFAULT 'viewer' NOT NULL,
	`course_section` text,
	`rules_accepted_at` text,
	`registered_at` text NOT NULL,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	CHECK (`role` IN ('viewer','editor','committee','admin'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_authenticated_user_id_unique` ON `users` (`authenticated_user_id`);
--> statement-breakpoint
CREATE INDEX `idx_runs` ON `refresh_runs` (`source_key`,`finished_at`);
--> statement-breakpoint
CREATE TRIGGER sources_no_update BEFORE UPDATE ON sources BEGIN SELECT RAISE(ABORT, 'sources is append-only: insert a new row'); END;
--> statement-breakpoint
CREATE TRIGGER sources_no_delete BEFORE DELETE ON sources BEGIN SELECT RAISE(ABORT, 'sources is append-only'); END;
--> statement-breakpoint
CREATE TRIGGER metrics_no_update BEFORE UPDATE ON metrics BEGIN SELECT RAISE(ABORT, 'metrics is append-only: insert a new row'); END;
--> statement-breakpoint
CREATE TRIGGER metrics_no_delete BEFORE DELETE ON metrics BEGIN SELECT RAISE(ABORT, 'metrics is append-only'); END;
--> statement-breakpoint
CREATE TRIGGER refresh_runs_no_update BEFORE UPDATE ON refresh_runs BEGIN SELECT RAISE(ABORT, 'refresh_runs is append-only: insert a new row'); END;
--> statement-breakpoint
CREATE TRIGGER refresh_runs_no_delete BEFORE DELETE ON refresh_runs BEGIN SELECT RAISE(ABORT, 'refresh_runs is append-only'); END;
--> statement-breakpoint
CREATE TRIGGER design_parameters_no_update BEFORE UPDATE ON design_parameters BEGIN SELECT RAISE(ABORT, 'design_parameters is append-only: insert a new row'); END;
--> statement-breakpoint
CREATE TRIGGER design_parameters_no_delete BEFORE DELETE ON design_parameters BEGIN SELECT RAISE(ABORT, 'design_parameters is append-only'); END;
--> statement-breakpoint
CREATE TRIGGER scenario_overrides_no_update BEFORE UPDATE ON scenario_overrides BEGIN SELECT RAISE(ABORT, 'scenario_overrides is append-only: insert a new row'); END;
--> statement-breakpoint
CREATE TRIGGER scenario_overrides_no_delete BEFORE DELETE ON scenario_overrides BEGIN SELECT RAISE(ABORT, 'scenario_overrides is append-only'); END;
--> statement-breakpoint
CREATE TRIGGER design_claims_no_update BEFORE UPDATE ON design_claims BEGIN SELECT RAISE(ABORT, 'design_claims is append-only: insert a new row'); END;
--> statement-breakpoint
CREATE TRIGGER design_claims_no_delete BEFORE DELETE ON design_claims BEGIN SELECT RAISE(ABORT, 'design_claims is append-only'); END;
--> statement-breakpoint
CREATE TRIGGER claim_links_no_update BEFORE UPDATE ON claim_links BEGIN SELECT RAISE(ABORT, 'claim_links is append-only: insert a new row'); END;
--> statement-breakpoint
CREATE TRIGGER claim_links_no_delete BEFORE DELETE ON claim_links BEGIN SELECT RAISE(ABORT, 'claim_links is append-only'); END;
--> statement-breakpoint
CREATE TRIGGER criterion_weights_no_update BEFORE UPDATE ON criterion_weights BEGIN SELECT RAISE(ABORT, 'criterion_weights is append-only: insert a new row'); END;
--> statement-breakpoint
CREATE TRIGGER criterion_weights_no_delete BEFORE DELETE ON criterion_weights BEGIN SELECT RAISE(ABORT, 'criterion_weights is append-only'); END;
--> statement-breakpoint
CREATE TRIGGER site_assessments_no_update BEFORE UPDATE ON site_assessments BEGIN SELECT RAISE(ABORT, 'site_assessments is append-only: insert a new row'); END;
--> statement-breakpoint
CREATE TRIGGER site_assessments_no_delete BEFORE DELETE ON site_assessments BEGIN SELECT RAISE(ABORT, 'site_assessments is append-only'); END;
--> statement-breakpoint
CREATE TRIGGER committee_decisions_no_update BEFORE UPDATE ON committee_decisions BEGIN SELECT RAISE(ABORT, 'committee_decisions is append-only: insert a new row'); END;
--> statement-breakpoint
CREATE TRIGGER committee_decisions_no_delete BEFORE DELETE ON committee_decisions BEGIN SELECT RAISE(ABORT, 'committee_decisions is append-only'); END;
--> statement-breakpoint
CREATE TRIGGER requirement_claims_no_update BEFORE UPDATE ON requirement_claims BEGIN SELECT RAISE(ABORT, 'requirement_claims is append-only: insert a new row'); END;
--> statement-breakpoint
CREATE TRIGGER requirement_claims_no_delete BEFORE DELETE ON requirement_claims BEGIN SELECT RAISE(ABORT, 'requirement_claims is append-only'); END;
--> statement-breakpoint
CREATE TRIGGER narratives_no_update BEFORE UPDATE ON narratives BEGIN SELECT RAISE(ABORT, 'narratives is append-only: insert a new row'); END;
--> statement-breakpoint
CREATE TRIGGER narratives_no_delete BEFORE DELETE ON narratives BEGIN SELECT RAISE(ABORT, 'narratives is append-only'); END;
--> statement-breakpoint
CREATE TRIGGER narrative_steps_no_update BEFORE UPDATE ON narrative_steps BEGIN SELECT RAISE(ABORT, 'narrative_steps is append-only: insert a new row'); END;
--> statement-breakpoint
CREATE TRIGGER narrative_steps_no_delete BEFORE DELETE ON narrative_steps BEGIN SELECT RAISE(ABORT, 'narrative_steps is append-only'); END;
--> statement-breakpoint
CREATE TRIGGER step_claims_no_update BEFORE UPDATE ON step_claims BEGIN SELECT RAISE(ABORT, 'step_claims is append-only: insert a new row'); END;
--> statement-breakpoint
CREATE TRIGGER step_claims_no_delete BEFORE DELETE ON step_claims BEGIN SELECT RAISE(ABORT, 'step_claims is append-only'); END;
--> statement-breakpoint
CREATE TRIGGER ai_requests_no_update BEFORE UPDATE ON ai_requests BEGIN SELECT RAISE(ABORT, 'ai_requests is append-only: insert a new row'); END;
--> statement-breakpoint
CREATE TRIGGER ai_requests_no_delete BEFORE DELETE ON ai_requests BEGIN SELECT RAISE(ABORT, 'ai_requests is append-only'); END;
--> statement-breakpoint
CREATE VIEW current_metrics AS SELECT * FROM (SELECT m.*, ROW_NUMBER() OVER (PARTITION BY m.metric_name, IFNULL(m.country_id,0), IFNULL(m.site_id,0), IFNULL(m.demand_region_id,0) ORDER BY m.retrieved_at DESC, m.id DESC) AS rn FROM metrics m) WHERE rn = 1;
--> statement-breakpoint
CREATE VIEW current_parameters AS SELECT * FROM (SELECT p.*, ROW_NUMBER() OVER (PARTITION BY p.design_id, p.name ORDER BY p.created_at DESC, p.id DESC) AS rn FROM design_parameters p) WHERE rn = 1;
--> statement-breakpoint
CREATE VIEW current_scenario_overrides AS SELECT * FROM (SELECT o.*, ROW_NUMBER() OVER (PARTITION BY o.scenario_id, o.parameter_name ORDER BY o.created_at DESC, o.id DESC) AS rn FROM scenario_overrides o) WHERE rn = 1;
--> statement-breakpoint
CREATE VIEW current_claims AS SELECT c.* FROM design_claims c WHERE NOT EXISTS (SELECT 1 FROM design_claims newer WHERE newer.supersedes_claim_id = c.id);
--> statement-breakpoint
CREATE VIEW current_sources AS SELECT s.* FROM sources s WHERE NOT EXISTS (SELECT 1 FROM sources newer WHERE newer.supersedes_source_id = s.id);
--> statement-breakpoint
CREATE VIEW current_weights AS SELECT * FROM (SELECT w.*, ROW_NUMBER() OVER (PARTITION BY w.criterion_code ORDER BY w.created_at DESC, w.id DESC) AS rn FROM criterion_weights w) WHERE rn = 1;
--> statement-breakpoint
CREATE VIEW current_assessments AS SELECT * FROM (SELECT a.*, ROW_NUMBER() OVER (PARTITION BY a.criterion_code, a.site_id ORDER BY a.created_at DESC, a.id DESC) AS rn FROM site_assessments a) WHERE rn = 1;
--> statement-breakpoint
CREATE VIEW current_narratives AS SELECT * FROM (SELECT n.*, ROW_NUMBER() OVER (PARTITION BY n.design_id, n.key ORDER BY n.version DESC, n.id DESC) AS rn FROM narratives n) WHERE rn = 1;
--> statement-breakpoint
CREATE VIEW stale_claims AS SELECT DISTINCT c.* FROM current_claims c JOIN claim_links l ON l.claim_id = c.id JOIN metrics m ON m.id = l.metric_id LEFT JOIN current_metrics cm ON cm.id = m.id WHERE l.metric_id IS NOT NULL AND cm.id IS NULL;
--> statement-breakpoint
CREATE VIEW requirement_status AS SELECT r.id AS requirement_id, r.design_id, r.stage, r.requirement_text, CASE WHEN COUNT(rc.claim_id) = 0 OR SUM(CASE WHEN c.claim_type = 'unknown' THEN 1 ELSE 0 END) > 0 THEN 'missing' WHEN COUNT(rc.claim_id) = COUNT(c.id) AND SUM(CASE WHEN c.status = 'verified' AND c.claim_type IN ('fact','calculation','design_decision') THEN 1 ELSE 0 END) = COUNT(rc.claim_id) THEN 'exists' ELSE 'partial' END AS status FROM evidence_requirements r LEFT JOIN requirement_claims rc ON rc.requirement_id = r.id LEFT JOIN current_claims c ON c.id = rc.claim_id GROUP BY r.id, r.design_id, r.stage, r.requirement_text;
