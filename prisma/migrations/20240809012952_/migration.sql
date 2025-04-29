-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('SALES', 'PREPRESS', 'ADMIN') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DisPlayQueue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderNumber` VARCHAR(191) NOT NULL,
    `erpNumber` VARCHAR(191) NULL,
    `status` ENUM('newJob', 'inQueue', 'working', 'waitToConfirm', 'completed', 'rejected', 'revised') NOT NULL,
    `prepressOwner` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `gotJobAt` VARCHAR(191) NULL,
    `finishJobToConfirmAt` VARCHAR(191) NULL,
    `CompletedAt` VARCHAR(191) NULL,
    `reviseCount` INTEGER NULL,
    `rejectCount` INTEGER NULL,
    `revisedRemark` VARCHAR(500) NULL,
    `rejectedRemark` VARCHAR(500) NULL,

    UNIQUE INDEX `Order_orderNumber_key`(`orderNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DisPlayQueue` ADD CONSTRAINT `DisPlayQueue_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
