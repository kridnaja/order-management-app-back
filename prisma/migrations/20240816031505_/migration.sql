/*
  Warnings:

  - You are about to drop the column `jobname` on the `suborder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `suborder` DROP COLUMN `jobname`,
    ADD COLUMN `jobName` VARCHAR(191) NULL;
