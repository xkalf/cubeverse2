ALTER TABLE `teacher` ADD `started_year` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `teacher` ADD `teaching_year` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `teacher` ADD `experience` text NOT NULL;--> statement-breakpoint
ALTER TABLE `teacher` ADD `rewards` text DEFAULT '[]' NOT NULL;