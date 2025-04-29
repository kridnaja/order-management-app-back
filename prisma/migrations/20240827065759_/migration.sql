/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `DisPlayQueue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `DisPlayQueue_orderId_key` ON `DisPlayQueue`(`orderId`);
