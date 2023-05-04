-- CreateTable
CREATE TABLE `SoapNote` (
    `id` VARCHAR(191) NOT NULL,
    `subjective` VARCHAR(191) NOT NULL,
    `objective` VARCHAR(191) NOT NULL,
    `assessment` VARCHAR(191) NOT NULL,
    `plan` VARCHAR(191) NOT NULL,
    `doctorId` VARCHAR(191) NULL,
    `postVisitReportId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SoapNote_postVisitReportId_key`(`postVisitReportId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VitalsReport` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `pulse` DOUBLE NOT NULL,
    `temperature` DOUBLE NOT NULL,
    `weight` DOUBLE NOT NULL,
    `respiration` DOUBLE NOT NULL,
    `oxygenSaturation` DOUBLE NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `postVisitReportId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `VitalsReport_postVisitReportId_key`(`postVisitReportId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VisitReport` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `doctorId` VARCHAR(191) NULL,
    `patientId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SoapNote` ADD CONSTRAINT `SoapNote_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SoapNote` ADD CONSTRAINT `SoapNote_postVisitReportId_fkey` FOREIGN KEY (`postVisitReportId`) REFERENCES `VisitReport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VitalsReport` ADD CONSTRAINT `VitalsReport_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VitalsReport` ADD CONSTRAINT `VitalsReport_postVisitReportId_fkey` FOREIGN KEY (`postVisitReportId`) REFERENCES `VisitReport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisitReport` ADD CONSTRAINT `VisitReport_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisitReport` ADD CONSTRAINT `VisitReport_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
