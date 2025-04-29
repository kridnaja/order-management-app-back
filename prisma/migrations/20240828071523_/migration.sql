/*
  Warnings:

  - You are about to drop the column `completedAt` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `completedAt`,
    ADD COLUMN `timeStamp` VARCHAR(191) NULL;
