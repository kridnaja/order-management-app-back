/*
  Warnings:

  - Added the required column `timeStamp` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notification` ADD COLUMN `timeStamp` DATETIME(3) NOT NULL;
