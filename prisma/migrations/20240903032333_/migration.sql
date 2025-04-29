-- CreateTable
CREATE TABLE `DeletedOrderLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NULL,
    `timeStamp` VARCHAR(191) NULL,
    `orderNumber` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `revisedRemark` VARCHAR(500) NULL,
    `rejectedRemark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
