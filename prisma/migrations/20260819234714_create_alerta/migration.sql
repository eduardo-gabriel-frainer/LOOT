 CREATE TABLE `alertas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `appid` INTEGER NOT NULL,
    `targetPrice` DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
