/*
  Warnings:

  - You are about to drop the column `CompletedAt` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `CreatedAt` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `CompletedAt`,
    DROP COLUMN `CreatedAt`,
    ADD COLUMN `completedAt` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `OrderLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `timeStamp` VARCHAR(191) NULL,
    `orderNumber` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `revisedRemark` VARCHAR(500) NULL,
    `rejectedRemark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderLog` ADD CONSTRAINT `OrderLog_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
