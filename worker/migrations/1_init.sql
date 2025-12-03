CREATE TABLE `attachments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`file_name` text NOT NULL,
	`file_key` text NOT NULL,
	`file_size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`uploaded_by_id` integer NOT NULL,
	`related_type` text,
	`related_id` integer,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`uploaded_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `attachments_file_key_unique` ON `attachments` (`file_key`);--> statement-breakpoint
CREATE TABLE `pr_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pr_id` integer NOT NULL,
	`stock_code` text NOT NULL,
	`description` text NOT NULL,
	`quantity` real NOT NULL,
	`uom` text NOT NULL,
	`unit_price` real NOT NULL,
	`total_price` real NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`pr_id`) REFERENCES `purchase_requisitions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `purchase_requisitions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pr_number` text NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`requested_by_id` integer NOT NULL,
	`department` text NOT NULL,
	`company` text NOT NULL,
	`urgency` text DEFAULT 'Medium' NOT NULL,
	`total_amount` real DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'MYR' NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`requested_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `purchase_requisitions_pr_number_unique` ON `purchase_requisitions` (`pr_number`);--> statement-breakpoint
CREATE TABLE `stock_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stock_code` text NOT NULL,
	`description` text NOT NULL,
	`category` text,
	`uom` text NOT NULL,
	`current_stock` real DEFAULT 0 NOT NULL,
	`unit_price` real DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stock_items_stock_code_unique` ON `stock_items` (`stock_code`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);