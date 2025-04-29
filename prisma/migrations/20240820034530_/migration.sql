/*
  Warnings:

  - You are about to drop the column `cmykBlack` on the `suborder` table. All the data in the column will be lost.
  - You are about to alter the column `cmyk` on the `suborder` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(3))`.
  - You are about to alter the column `cmykEtc` on the `suborder` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `suborder` DROP COLUMN `cmykBlack`,
    MODIFY `cmyk` ENUM('cmyk', 'black', 'etc') NULL,
    MODIFY `cmykEtc` VARCHAR(191) NULL;
