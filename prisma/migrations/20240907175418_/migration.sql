-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('newJob', 'holding', 'inQueue', 'working', 'rejected', 'waitForPrepressToCheck', 'checking', 'rejectedAfterChecked', 'waitToConfirm', 'revised', 'completed', 'urgentJob', 'layoutWorking', 'readyToLayout', 'completedAfterLayout') NOT NULL;
