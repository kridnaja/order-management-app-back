/*
  Warnings:

  - You are about to drop the column `erpNumber` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `erpNumber`,
    ADD COLUMN `quotationNumber` VARCHAR(191) NULL;
