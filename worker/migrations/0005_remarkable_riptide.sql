CREATE TABLE `staff` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`staff_id` text NOT NULL,
	`full_name` text NOT NULL,
	`nric` text,
	`email` text,
	`position` text,
	`department` text,
	`manager_staff_id` text,
	`phone` text,
	`photo_url` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `staff_staff_id_unique` ON `staff` (`staff_id`);