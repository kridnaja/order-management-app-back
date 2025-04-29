/*
  Warnings:

  - The values [afterCompleted] on the enum `Order_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('newJob', 'holding', 'inQueue', 'working', 'rejected', 'waitForPrepressToCheck', 'checking', 'rejectedAfterChecked', 'waitToConfirm', 'revised', 'completed', 'urgentJob', 'readyToRay', 'completedAfterRay') NOT NULL;
