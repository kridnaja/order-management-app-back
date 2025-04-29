-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('newJob', 'inQueue', 'working', 'waitToConfirm', 'checking', 'completed', 'rejected', 'rejectedAfterChecked', 'revised', 'holding', 'waitForPrepressToCheck') NOT NULL;
