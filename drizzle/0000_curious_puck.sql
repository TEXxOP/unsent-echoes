CREATE TABLE `inboxes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`handle` text NOT NULL,
	`inbox_key_hash` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `inboxes_handle_unique` ON `inboxes` (`handle`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipient_handle` text NOT NULL,
	`body` text NOT NULL,
	`theme` text DEFAULT 'light' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`recipient_handle`) REFERENCES `inboxes`(`handle`) ON UPDATE no action ON DELETE cascade
);
