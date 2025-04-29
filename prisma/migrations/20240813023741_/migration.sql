-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('newJob', 'inQueue', 'working', 'waitToConfirm', 'completed', 'rejected', 'revised', 'holding') NOT NULL;
