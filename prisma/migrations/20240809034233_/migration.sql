-- AlterTable
ALTER TABLE `order` MODIFY `reviseCount` INTEGER NULL DEFAULT 0,
    MODIFY `rejectCount` INTEGER NULL DEFAULT 0;
