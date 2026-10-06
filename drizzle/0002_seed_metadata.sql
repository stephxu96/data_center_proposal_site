-- Add stable seed identifiers and review provenance after Phase 3 deployment.
ALTER TABLE `claim_links` ADD `seed_key` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `claim_links_seed_key_unique` ON `claim_links` (`seed_key`);
--> statement-breakpoint
ALTER TABLE `countries` ADD `seed_key` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `countries_seed_key_unique` ON `countries` (`seed_key`);
--> statement-breakpoint
ALTER TABLE `criterion_weights` ADD `seed_key` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `criterion_weights_seed_key_unique` ON `criterion_weights` (`seed_key`);
--> statement-breakpoint
ALTER TABLE `demand_regions` ADD `seed_key` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `demand_regions_seed_key_unique` ON `demand_regions` (`seed_key`);
--> statement-breakpoint
ALTER TABLE `design_claims` ADD `seed_key` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `design_claims_seed_key_unique` ON `design_claims` (`seed_key`);
--> statement-breakpoint
ALTER TABLE `design_parameters` ADD `seed_key` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `design_parameters_seed_key_unique` ON `design_parameters` (`seed_key`);
--> statement-breakpoint
ALTER TABLE `designs` ADD `seed_key` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `designs_seed_key_unique` ON `designs` (`seed_key`);
--> statement-breakpoint
ALTER TABLE `evidence_requirements` ADD `seed_key` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `evidence_requirements_seed_key_unique` ON `evidence_requirements` (`seed_key`);
--> statement-breakpoint
ALTER TABLE `metrics` ADD `seed_key` text;
--> statement-breakpoint
ALTER TABLE `metrics` ADD `verified_by` text;
--> statement-breakpoint
ALTER TABLE `metrics` ADD `verified_at` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `metrics_seed_key_unique` ON `metrics` (`seed_key`);
--> statement-breakpoint
ALTER TABLE `narrative_steps` ADD `seed_key` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `narrative_steps_seed_key_unique` ON `narrative_steps` (`seed_key`);
--> statement-breakpoint
ALTER TABLE `narratives` ADD `seed_key` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `narratives_seed_key_unique` ON `narratives` (`seed_key`);
--> statement-breakpoint
ALTER TABLE `scenarios` ADD `seed_key` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `scenarios_seed_key_unique` ON `scenarios` (`seed_key`);
--> statement-breakpoint
ALTER TABLE `site_assessments` ADD `seed_key` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `site_assessments_seed_key_unique` ON `site_assessments` (`seed_key`);
--> statement-breakpoint
ALTER TABLE `sites` ADD `seed_key` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `sites_seed_key_unique` ON `sites` (`seed_key`);
--> statement-breakpoint
ALTER TABLE `sources` ADD `seed_key` text;
--> statement-breakpoint
ALTER TABLE `sources` ADD `verified_by` text;
--> statement-breakpoint
ALTER TABLE `sources` ADD `verified_at` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `sources_seed_key_unique` ON `sources` (`seed_key`);
--> statement-breakpoint
ALTER TABLE `teams` ADD `seed_key` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `teams_seed_key_unique` ON `teams` (`seed_key`);
