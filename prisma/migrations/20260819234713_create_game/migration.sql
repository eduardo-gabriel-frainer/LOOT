-- CreateTable
CREATE TABLE `Games` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `appid` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(500) NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Game_appId_key`(`appid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
