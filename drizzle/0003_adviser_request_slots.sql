CREATE TABLE `adviser_request_slots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`team_id` integer NOT NULL,
	`created_at` text NOT NULL,
	`reserved_tokens` integer NOT NULL CHECK (`reserved_tokens` >= 0),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_adviser_slots_user` ON `adviser_request_slots` (`user_id`,`created_at`);
--> statement-breakpoint
CREATE INDEX `idx_adviser_slots_team` ON `adviser_request_slots` (`team_id`,`created_at`);
