ALTER TABLE message
ADD COLUMN isRead TINYINT(1) AFTER detail;

ALTER TABLE `attachment`
ADD COLUMN `replyId` INT(10) UNSIGNED NULL AFTER `eventPostId`;

ALTER TABLE `attachment`
ADD CONSTRAINT `attachment_ibfk_7`
  FOREIGN KEY (`replyId`)
  REFERENCES `reply` (`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `user`
CHANGE COLUMN `aboutMe` `aboutMe` TEXT CHARACTER SET 'utf8' NULL DEFAULT NULL ;

ALTER TABLE `campus_user`
ADD UNIQUE INDEX `campusEmail_UNIQUE` (`campusEmail` ASC)

ALTER TABLE `job`
CHANGE COLUMN `price` `price` DOUBLE NULL DEFAULT NULL ;

ALTER TABLE `job`
CHANGE COLUMN `price` `price` VARCHAR(255) NULL DEFAULT NULL ;

ALTER TABLE `post_reply`
CHANGE COLUMN `comment` `comment` TEXT CHARACTER SET 'utf8' NULL DEFAULT NULL ;

ALTER TABLE `attachment`
DROP FOREIGN KEY `attachment_ibfk_7`;
ALTER TABLE `attachment`
DROP INDEX `attachment_ibfk_7` ,
ADD INDEX `attachment_ibfk_7_idx` (`replyId` ASC);
ALTER TABLE `attachment`
ADD CONSTRAINT `attachment_ibfk_7`
  FOREIGN KEY (`replyId`)
  REFERENCES `post_reply` (`id`)
  ON DELETE SET NULL
  ON UPDATE CASCADE;

ALTER TABLE `reply`
CHANGE COLUMN `comment` `comment` TEXT CHARACTER SET 'utf8' NULL DEFAULT NULL ;

ALTER TABLE `postv1`
CHANGE COLUMN `description` `description` TEXT CHARACTER SET 'utf8' NULL DEFAULT NULL ;


ALTER TABLE `work_experience`
ADD COLUMN `skill` VARCHAR(255) NULL AFTER `role`,
ADD COLUMN `achievement` VARCHAR(255) NULL AFTER `skill`;

ALTER TABLE `user_follower`
ADD COLUMN `token` VARCHAR(255) NULL AFTER `followerId`,
ADD COLUMN `isVerified` TINYINT(1) NULL DEFAULT 0 AFTER `token`;

update `user_follower`
set isVerified=true;