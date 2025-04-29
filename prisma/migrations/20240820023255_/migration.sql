/*
  Warnings:

  - You are about to drop the column `erpNumber` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `finishJobToConfirmAt` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `gotJobAt` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `erpNumber`,
    DROP COLUMN `finishJobToConfirmAt`,
    DROP COLUMN `gotJobAt`,
    ADD COLUMN `CreatedAt` VARCHAR(191) NULL;
