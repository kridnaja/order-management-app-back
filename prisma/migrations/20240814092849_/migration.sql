/*
  Warnings:

  - You are about to drop the column `notiUserId` on the `notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `notification` DROP COLUMN `notiUserId`,
    ADD COLUMN `userId` INTEGER NULL;
