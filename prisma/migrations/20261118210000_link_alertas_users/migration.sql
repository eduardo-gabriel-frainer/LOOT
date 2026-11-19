ALTER TABLE `alertas`
    ADD COLUMN `userId` INTEGER NULL,
    ADD COLUMN `notifiedAt` DATETIME(3) NULL,
    ADD INDEX `alertas_userId_idx` (`userId`),
    ADD CONSTRAINT `alertas_userId_fkey`
        FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
        ON DELETE SET NULL
        ON UPDATE CASCADE;
