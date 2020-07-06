ALTER TABLE `user` 
ADD COLUMN `email_send_date` DATETIME NULL AFTER `campusId`;

ALTER TABLE `user` 
ADD COLUMN `last_logging_time` DATETIME NULL AFTER `email_send_date`;

ALTER TABLE `user` 
ADD COLUMN `email_verify_code` VARCHAR(45) NULL AFTER `last_logging_time`;

ALTER TABLE `user` 
ADD COLUMN `facebook_profile` VARCHAR(255) NULL AFTER `email_verify_code`,
ADD COLUMN `twitter_profile` VARCHAR(255) NULL AFTER `facebook_profile`,
ADD COLUMN `snapchat_profile` VARCHAR(255) NULL AFTER `twitter_profile`,
ADD COLUMN `instagram_profile` VARCHAR(255) NULL AFTER `snapchat_profile`;

ALTER TABLE `user` 
ADD COLUMN `gpa` VARCHAR(255) NULL AFTER `instagram_profile`;

ALTER TABLE `campus` 
ADD COLUMN `enrollment_year` DATETIME NULL AFTER `updatedAt`,
ADD COLUMN `logo` VARCHAR(255) NULL AFTER `enrollment_year`;

ALTER TABLE `campus` 
ADD COLUMN `status` TINYINT NULL DEFAULT 0 AFTER `logo`;

ALTER TABLE `campus_user` 
ADD COLUMN `enrollment_year` DATETIME NULL AFTER `updatedAt`;

ALTER TABLE `job` 
ADD COLUMN `source_link` TEXT NULL AFTER `deadline`;

ALTER TABLE `job` 
ADD COLUMN `price` TEXT NULL AFTER `source_link`;

ALTER TABLE `job` 
ADD COLUMN `currency` VARCHAR(10) NULL DEFAULT '$' AFTER `price`;

ALTER TABLE `user` 
ADD COLUMN `graduate_at` DATETIME NULL AFTER `schoolName`;

ALTER TABLE `user` 
ADD COLUMN `country` VARCHAR(255) NULL DEFAULT NULL AFTER `city`;


ALTER TABLE `scholarship` 
ADD COLUMN `source_link` TEXT NULL AFTER `deadline`;

ALTER TABLE `scholarship` 
ADD COLUMN `price` TEXT NULL AFTER `source_link`;

ALTER TABLE `scholarship` 
ADD COLUMN `currency` VARCHAR(10) NULL DEFAULT '$' AFTER `price`;

ALTER TABLE `job` 
ADD COLUMN `industry` VARCHAR(255) NULL DEFAULT NULL AFTER `city`;

ALTER TABLE `job` 
ADD COLUMN `company_logo` VARCHAR(255) NULL DEFAULT NULL AFTER `company`;

ALTER TABLE `reply` 
ADD COLUMN `isAnonymous` TINYINT(4) NULL DEFAULT '0' AFTER `tagUserId`;

ALTER TABLE `job` 
ADD COLUMN `industryId` INT NULL DEFAULT NULL AFTER `industry`;

ALTER TABLE `manual-job` 
ADD COLUMN `isApplied` INT NULL DEFAULT NULL AFTER `status`;

ALTER TABLE `work_experience` 
ADD COLUMN `skill` VARCHAR(255) NULL AFTER `role`,
ADD COLUMN `achievement` VARCHAR(255) NULL AFTER `skill`;

ALTER TABLE `user_follower` 
ADD COLUMN `token` VARCHAR(255) NULL AFTER `followerId`,
ADD COLUMN `isVerified` TINYINT(1) NULL DEFAULT 0 AFTER `token`;

ALTER TABLE `job` 
ADD COLUMN `province` VARCHAR(255) NULL DEFAULT NULL AFTER `country`;
