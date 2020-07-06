SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

CREATE TABLE IF NOT EXISTS `notification` (`id` INTEGER UNSIGNED auto_increment , `notification` VARCHAR(255),
`isRead` TINYINT(1), `type` VARCHAR(255), `detail` VARCHAR(255), `createdAt` DATETIME NOT NULL,
`updatedAt` DATETIME NOT NULL, `subject` INTEGER UNSIGNED, PRIMARY KEY (`id`),
FOREIGN KEY (`subject`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `message` (`id` INTEGER UNSIGNED auto_increment , `title` VARCHAR(255), `detail` VARCHAR(255),
`isRead` TINYINT(1), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `fromId` INTEGER UNSIGNED,
`toId` INTEGER UNSIGNED, `parentId` INTEGER UNSIGNED, PRIMARY KEY (`id`),
FOREIGN KEY (`fromId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
FOREIGN KEY (`toId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
FOREIGN KEY (`parentId`) REFERENCES `message` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `work_experience` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) NULL,
  `from` DATETIME NULL,
  `to` DATETIME NULL,
  `userId`  INTEGER UNSIGNED,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`)
    REFERENCES `user` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `skill` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`)) ENGINE=InnoDB COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_skill` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT UNSIGNED,
  `skillId` INT UNSIGNED,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`)
    REFERENCES `user` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`skillId`)
    REFERENCES `skill` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `postv1_reply_rating` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `rating` FLOAT,
  `userId` INT UNSIGNED,
  `replyId` INT UNSIGNED,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`)
    REFERENCES `user` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`replyId`)
    REFERENCES `reply` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `campus_user` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT(10) UNSIGNED,
  `campusId` INT(10) UNSIGNED,
  `campusEmail` VARCHAR(45) NULL,
  `token` VARCHAR(45) NULL,
  `emailVerified` TINYINT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`)
    REFERENCES `user` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`campusId`)
    REFERENCES `campus` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `education` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `level` VARCHAR(255) NULL,
  `from` DATETIME NULL,
  `to` DATETIME NULL,
  `major` VARCHAR(255) NULL,
  `minor` VARCHAR(255) NULL,
  `department_gpa` VARCHAR(255) NULL,
  `cumulative_gpa` VARCHAR(255) NULL,
  `is_hide_department_gpa` TINYINT NULL DEFAULT 0,
  `is_hide_cumulative_gpa` TINYINT NULL DEFAULT 0,
  `userId`  INTEGER UNSIGNED,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`)
    REFERENCES `user` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `award` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `position` VARCHAR(255) NOT NULL,
  `organization` VARCHAR(255) NULL,
  `from` DATETIME NULL,
  `to` DATETIME NULL,
  `current_position` TINYINT NULL DEFAULT 0,
  `location` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `userId`  INTEGER UNSIGNED,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`)
    REFERENCES `user` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `job` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) NULL,
  `company_bio` TEXT NULL,
  `country` VARCHAR(255) NULL,
  `city` VARCHAR(255) NULL,
  `contact` VARCHAR(255) NULL,
  `type` TINYINT NULL DEFAULT 0,
  `experience` TEXT NULL,
  `jobfunction` TEXT NULL,
  `deadline` DATETIME NULL,
  `userId`  INTEGER UNSIGNED,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`)
    REFERENCES `user` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `scholarship` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `details` TEXT NULL,
  `country` VARCHAR(255) NULL,
  `city` VARCHAR(255) NULL,
  `contact` VARCHAR(255) NULL,
  `type` TINYINT NULL DEFAULT 0,
  `eligibility_requirements` TEXT NULL,
  `benefits` TEXT NULL,
  `deadline` DATETIME NULL,
  `userId`  INTEGER UNSIGNED,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`)
    REFERENCES `user` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `industry` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`)) ENGINE=INNODB COLLATE utf8_unicode_ci;

INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (1,'Accounting','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (2,'Advertising, PR & marketing','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (3,'Aerospace','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (4,'Animal & Wildlife','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (5,'Architecture & Planning','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (6,'Automotive','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (7,'Biotech and Life sciences','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (8,'Civil Engineering','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (9,'Commercial banking and Credit','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (10,'Computer Networking','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (11,'Construction','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (12,'CPG- Consumer Packaged Goods','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (13,'Defense','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (14,'Design','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (15,'Electronic & Computer Hardware','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (16,'Environmental service','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (17,'Farming, Ranching & Fishing','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (18,'Fashion','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (19,'Food and  Beverage','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (20,'Forestry','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (21,'Government - Local, State & Federal','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (22,'Healthcare','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (23,'Higher education','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (24,'Hotels & Accommodation','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (25,'Human Resources','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (26,'Insurance','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (27,'Interior Design','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (28,'International Affairs','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (29,'Internet & Software','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (30,'Investment Banking','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (31,'Investment /portfolio management','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (32,'Journalism, Media & Publishing','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (33,'K12 Education','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (34,'Legal & Law Enforcement','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (35,'Management consulting','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (36,'Manufacturing-other','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (37,'Medical devices','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (38,'Movies, TV, Music','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (39,'Natural Resources','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (40,'NGO','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (41,'Non Profit','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (42,'Oil & Gas','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (43,'Other Agriculture','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (44,'Other Education','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (45,'Performing & Fine Arts','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (46,'Pharmaceuticals','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (47,'Politics','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (48,'Real Estate','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (49,'Religious Work','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (50,'Retail Stores','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (51,'Restaurant and Food service','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (52,'Research','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (53,'Scientific & Technical Consulting','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (54,'Sports & Leisure','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (55,'Telecommunications','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (56,'Tourism','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (57,'Transportation & Logistics','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (58,'Utilities & Renewable Energy','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (59,'Veterinary','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (60,'Wholesale Trade','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (61,'Creative Arts','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (62,'Consultancy','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (63,'E-commerce','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (64,'Media','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (65,'Social work','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (66,'Quality Assurance','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (67,'Business Development','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (68,'Management and Administration','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (69,'Finance','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (70,'Communication and Media Studies','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (71,'Information Technology','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (72,'Web and App development','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (73,'Chemistry','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (74,'Dentistry','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (75,'Medical services','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (76,'Engineering-Mechanical','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (77,'Engineering-Electrical','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (78,'Engineering-Chemical','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (79,'Engineering-Mechatronics','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (80,'Digital Marketing','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (81,'Physiology','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (82,'Psychology','2020-03-05 14:50:33','2020-03-05 14:50:33');
INSERT INTO `industry` (`id`,`name`,`createdAt`,`updatedAt`) VALUES (83,'Wellness','2020-03-05 14:50:33','2020-03-05 14:50:33');

CREATE TABLE IF NOT EXISTS `blog` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NULL,
  `userId`  INTEGER UNSIGNED,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`)
    REFERENCES `user` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `saved-job` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `jobId` INTEGER UNSIGNED,
  `userId`  INTEGER UNSIGNED,
  `status` VARCHAR(255) NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`)
    REFERENCES `user` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`jobId`)
    REFERENCES `job` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `manual-job` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `jobfunction` TEXT NULL,
  `company` VARCHAR(255) NULL,
  `deadline` DATETIME NULL,
  `source_link` VARCHAR(255) NULL,
  `userId`  INTEGER UNSIGNED,
  `status` VARCHAR(255) NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`)
    REFERENCES `user` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB COLLATE utf8_unicode_ci;



DROP TABLE IF EXISTS `user_company`;


DROP TABLE IF EXISTS `company_attachment`;


DROP TABLE IF EXISTS `company`;

CREATE TABLE `company` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `company` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `company_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `company_size` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `company_contact` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `recruit` tinyint(4) DEFAULT '1',
  `industry` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `company_bio` text COLLATE utf8_unicode_ci,
  `logo` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `file1` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `file2` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `userId` int(10) unsigned DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
    KEY `userId` (`userId`),
	 CONSTRAINT `company_users_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
 ) ENGINE=InnoDB AUTO_INCREMENT=366 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


 CREATE TABLE `company_attachment` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `usage` enum('logo','image','poster','video') COLLATE utf8_unicode_ci DEFAULT NULL,
  `cloudinaryPublicId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `companyId` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `companyId` (`companyId`),
  CONSTRAINT `company_attachment_ibfk_1` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `user_company`;


DROP TABLE IF EXISTS `company_attachment`;


DROP TABLE IF EXISTS `company`;

CREATE TABLE `company` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `company` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `company_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `company_size` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `company_contact` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `recruit` tinyint(4) DEFAULT '1',
  `industry` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `company_bio` text COLLATE utf8_unicode_ci,
  `logo` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `file1` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `file2` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `userId` int(10) unsigned DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
    KEY `userId` (`userId`),
	 CONSTRAINT `company_users_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
 ) ENGINE=InnoDB AUTO_INCREMENT=366 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

 
 CREATE TABLE `company_attachment` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `usage` enum('logo','image','poster','video') COLLATE utf8_unicode_ci DEFAULT NULL,
  `cloudinaryPublicId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `companyId` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `companyId` (`companyId`),
  CONSTRAINT `company_attachment_ibfk_1` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `user_company` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(10) unsigned DEFAULT NULL,
  `companyUserId` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `companyUserId` (`companyUserId`),
  CONSTRAINT `user_company_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `user_company_ibfk_2` FOREIGN KEY (`companyUserId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=469 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
