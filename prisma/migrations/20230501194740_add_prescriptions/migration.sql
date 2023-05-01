/*
  Warnings:

  - Added the required column `dosageFreq` to the `MedItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MedItem` ADD COLUMN `dosageFreq` VARCHAR(191) NOT NULL;
