CREATE TABLE `goods_received_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`grn_number` text NOT NULL,
	`po_id` integer NOT NULL,
	`supplier_id` integer NOT NULL,
	`received_date` integer NOT NULL,
	`delivery_order_no` text,
	`invoice_no` text,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`remarks` text,
	`received_by_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`po_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`received_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `goods_received_notes_grn_number_unique` ON `goods_received_notes` (`grn_number`);--> statement-breakpoint
CREATE TABLE `grn_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`grn_id` integer NOT NULL,
	`po_item_id` integer,
	`stock_code` text NOT NULL,
	`description` text NOT NULL,
	`ordered_quantity` real NOT NULL,
	`received_quantity` real NOT NULL,
	`uom` text NOT NULL,
	`remarks` text,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`grn_id`) REFERENCES `goods_received_notes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`po_item_id`) REFERENCES `po_items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `internal_transfers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`transfer_number` text NOT NULL,
	`from_location` text NOT NULL,
	`to_location` text NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`requested_by_id` integer NOT NULL,
	`approved_by_id` integer,
	`remarks` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`requested_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`approved_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `internal_transfers_transfer_number_unique` ON `internal_transfers` (`transfer_number`);--> statement-breakpoint
CREATE TABLE `po_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`po_id` integer NOT NULL,
	`stock_code` text NOT NULL,
	`description` text NOT NULL,
	`quantity` real NOT NULL,
	`received_quantity` real DEFAULT 0,
	`uom` text NOT NULL,
	`unit_price` real NOT NULL,
	`discount` real DEFAULT 0,
	`tax_code` text,
	`tax_rate` real DEFAULT 0,
	`total_price` real NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`po_id`) REFERENCES `purchase_orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `purchase_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`po_number` text NOT NULL,
	`pr_id` integer,
	`supplier_id` integer NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`order_date` integer,
	`expected_delivery_date` integer,
	`total_amount` real DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'MYR' NOT NULL,
	`payment_terms` text,
	`remarks` text,
	`created_by_id` integer NOT NULL,
	`approved_by_id` integer,
	`approved_at` integer,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`pr_id`) REFERENCES `purchase_requisitions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`approved_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `purchase_orders_po_number_unique` ON `purchase_orders` (`po_number`);--> statement-breakpoint
CREATE INDEX `purchase_orders_status_idx` ON `purchase_orders` (`status`);--> statement-breakpoint
CREATE INDEX `purchase_orders_supplier_idx` ON `purchase_orders` (`supplier_id`);--> statement-breakpoint
CREATE TABLE `stock_movements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stock_item_id` integer NOT NULL,
	`movement_type` text NOT NULL,
	`quantity` real NOT NULL,
	`balance_before` real NOT NULL,
	`balance_after` real NOT NULL,
	`reference_type` text,
	`reference_id` integer,
	`remarks` text,
	`created_by_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`stock_item_id`) REFERENCES `stock_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `stock_movements_stock_item_idx` ON `stock_movements` (`stock_item_id`);--> statement-breakpoint
CREATE INDEX `stock_movements_type_idx` ON `stock_movements` (`movement_type`);--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`supplier_code` text NOT NULL,
	`name` text NOT NULL,
	`contact_person` text,
	`email` text,
	`phone` text,
	`address` text,
	`payment_terms` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `suppliers_supplier_code_unique` ON `suppliers` (`supplier_code`);--> statement-breakpoint
CREATE TABLE `transfer_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`transfer_id` integer NOT NULL,
	`stock_item_id` integer NOT NULL,
	`quantity` real NOT NULL,
	`received_quantity` real DEFAULT 0,
	`remarks` text,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`transfer_id`) REFERENCES `internal_transfers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`stock_item_id`) REFERENCES `stock_items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `pr_items` ADD `discount` real DEFAULT 0;--> statement-breakpoint
ALTER TABLE `pr_items` ADD `tax_code` text;--> statement-breakpoint
ALTER TABLE `pr_items` ADD `tax_rate` real DEFAULT 0;--> statement-breakpoint
ALTER TABLE `purchase_requisitions` ADD `approved_by_id` integer REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `purchase_requisitions` ADD `approved_at` integer;--> statement-breakpoint
CREATE INDEX `purchase_requisitions_status_idx` ON `purchase_requisitions` (`status`);--> statement-breakpoint
CREATE INDEX `purchase_requisitions_requested_by_idx` ON `purchase_requisitions` (`requested_by_id`);--> statement-breakpoint
ALTER TABLE `stock_items` ADD `min_stock_level` real DEFAULT 0;--> statement-breakpoint
ALTER TABLE `stock_items` ADD `max_stock_level` real;--> statement-breakpoint
ALTER TABLE `stock_items` ADD `location` text;--> statement-breakpoint
CREATE INDEX `stock_items_category_idx` ON `stock_items` (`category`);--> statement-breakpoint
ALTER TABLE `users` ADD `department` text;