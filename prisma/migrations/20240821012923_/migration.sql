/*
  Warnings:

  - You are about to drop the column `blank` on the `suborder` table. All the data in the column will be lost.
  - You are about to drop the column `blankTest` on the `suborder` table. All the data in the column will be lost.
  - You are about to drop the column `cmyk` on the `suborder` table. All the data in the column will be lost.
  - You are about to drop the column `coated` on the `suborder` table. All the data in the column will be lost.
  - You are about to drop the column `coatedEtc` on the `suborder` table. All the data in the column will be lost.
  - You are about to drop the column `coldFoilEtc` on the `suborder` table. All the data in the column will be lost.
  - You are about to drop the column `core` on the `suborder` table. All the data in the column will be lost.
  - You are about to drop the column `fsc` on the `suborder` table. All the data in the column will be lost.
  - You are about to drop the column `offset` on the `suborder` table. All the data in the column will be lost.
  - You are about to drop the column `original` on the `suborder` table. All the data in the column will be lost.
  - You are about to drop the column `originalErp` on the `suborder` table. All the data in the column will be lost.
  - You are about to drop the column `originalEtc` on the `suborder` table. All the data in the column will be lost.
  - You are about to drop the column `roll` on the `suborder` table. All the data in the column will be lost.
  - You are about to drop the column `sticker` on the `suborder` table. All the data in the column will be lost.
  - You are about to drop the column `subErp` on the `suborder` table. All the data in the column will be lost.
  - You are about to drop the column `subOriginalErp` on the `suborder` table. All the data in the column will be lost.
  - You are about to drop the column `uv` on the `suborder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `suborder` DROP COLUMN `blank`,
    DROP COLUMN `blankTest`,
    DROP COLUMN `cmyk`,
    DROP COLUMN `coated`,
    DROP COLUMN `coatedEtc`,
    DROP COLUMN `coldFoilEtc`,
    DROP COLUMN `core`,
    DROP COLUMN `fsc`,
    DROP COLUMN `offset`,
    DROP COLUMN `original`,
    DROP COLUMN `originalErp`,
    DROP COLUMN `originalEtc`,
    DROP COLUMN `roll`,
    DROP COLUMN `sticker`,
    DROP COLUMN `subErp`,
    DROP COLUMN `subOriginalErp`,
    DROP COLUMN `uv`,
    ADD COLUMN `additionalEtc` BOOLEAN NULL,
    ADD COLUMN `outsourceType` ENUM('STICKER', 'OFFSET', 'FSC') NULL,
    ADD COLUMN `subAdditionalEtc` VARCHAR(191) NULL,
    ADD COLUMN `subCoatedEtc` VARCHAR(191) NULL,
    ADD COLUMN `subColdFoilEtc` VARCHAR(191) NULL,
    ADD COLUMN `subTypeOfFormatErp` VARCHAR(191) NULL,
    ADD COLUMN `typeOfCoated` ENUM('POG', 'POM', 'BOPP', 'COATEDETC') NULL,
    ADD COLUMN `typeOfColor` ENUM('CMYK', 'BLACK', 'ETC') NULL,
    ADD COLUMN `typeOfCore` ENUM('ONEINCH', 'ONEPONITFIVEINCH', 'THREEINCH') NULL,
    ADD COLUMN `typeOfFormat` ENUM('ORIGINAL', 'BLANKTEST', 'BLANK') NULL,
    ADD COLUMN `typeOfFormatErp` BOOLEAN NULL,
    ADD COLUMN `typeOfRoll` ENUM('OUTERROLL', 'INSIDEROLL') NULL,
    ADD COLUMN `typeOfUv` ENUM('GLOSS', 'MATT') NULL,
    MODIFY `coldFoil` ENUM('SILVER', 'GOLD', 'TYPEOFCOLDFOILETC') NULL,
    MODIFY `purchaseOrderQty` VARCHAR(191) NULL;
