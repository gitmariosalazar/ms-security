-- CreateTable
CREATE TABLE `user_type` (
    `id_user_type` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_type_name_key`(`name`),
    PRIMARY KEY (`id_user_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permission` (
    `id_permission` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `permission_name_key`(`name`),
    PRIMARY KEY (`id_permission`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permissions` (
    `id_role_permission` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user_type` INTEGER NOT NULL,
    `id_permission` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_user_permission`(`id_user_type`, `id_permission`),
    PRIMARY KEY (`id_role_permission`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id_user` VARCHAR(191) NOT NULL,
    `user_email` VARCHAR(100) NOT NULL,
    `user_password` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `user_active` BOOLEAN NOT NULL DEFAULT true,
    `id_user_type` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_user_email_key`(`user_email`),
    INDEX `users_user_email_idx`(`user_email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `type_notification` (
    `id_type_notification` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_type_notification`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `priority` (
    `id_priority` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_priority`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id_notifications` VARCHAR(191) NOT NULL,
    `email` VARCHAR(100) NULL,
    `phone` VARCHAR(15) NULL,
    `subject` VARCHAR(150) NULL,
    `message` TEXT NOT NULL,
    `id_notification_type` INTEGER NOT NULL,
    `id_status` INTEGER NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `sent_at` TIMESTAMP(6) NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL,
    `process_code` INTEGER NOT NULL,
    `id_priority` INTEGER NOT NULL,
    `logs_notification` JSON NULL,

    INDEX `notifications_id_notification_type_idx`(`id_notification_type`),
    INDEX `notifications_process_code_idx`(`process_code`),
    PRIMARY KEY (`id_notifications`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `type_service` (
    `id_type_service` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_type_service`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service` (
    `id_service` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `id_type_service` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_service`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entity` (
    `id_entity` INTEGER NOT NULL AUTO_INCREMENT,
    `ruc` VARCHAR(13) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `cellphone` VARCHAR(15) NOT NULL,
    `telephone` VARCHAR(15) NULL,
    `address` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `entity_ruc_key`(`ruc`),
    INDEX `entity_ruc_idx`(`ruc`),
    PRIMARY KEY (`id_entity`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `type_document` (
    `id_type_document` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_type_document`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `type_status` (
    `id_type_status` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_type_status`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status` (
    `id_status` INTEGER NOT NULL AUTO_INCREMENT,
    `id_type_status` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_status`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `process` (
    `id_process` INTEGER NOT NULL AUTO_INCREMENT,
    `process_number` VARCHAR(100) NOT NULL,
    `value` DECIMAL(10, 2) NULL,
    `category` VARCHAR(100) NOT NULL,
    `id_entity` INTEGER NOT NULL,
    `description` TEXT NULL,
    `time_execution` VARCHAR(100) NOT NULL,
    `process_object` VARCHAR(200) NOT NULL,
    `email_manager` VARCHAR(100) NULL,
    `full_name_manager` VARCHAR(100) NULL,
    `phone_manager` VARCHAR(15) NULL,
    `status_process` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `id_status` INTEGER NOT NULL,

    UNIQUE INDEX `process_process_number_key`(`process_number`),
    INDEX `process_process_number_idx`(`process_number`),
    PRIMARY KEY (`id_process`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document` (
    `id_document` INTEGER NOT NULL AUTO_INCREMENT,
    `id_type_document` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `date_request` DATE NULL,
    `date_reception` DATE NULL,
    `name_manager` VARCHAR(100) NULL,
    `process_code` INTEGER NOT NULL,
    `document_link` VARCHAR(255) NULL,
    `id_status` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `document_process_code_idx`(`process_code`),
    PRIMARY KEY (`id_document`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pay_type` (
    `id_pay_type` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_pay_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_invoice` (
    `id_detail_invoice` INTEGER NOT NULL AUTO_INCREMENT,
    `process_code` INTEGER NOT NULL,
    `total_value` DECIMAL(10, 2) NOT NULL,
    `invoice_number` VARCHAR(25) NOT NULL,
    `id_entity` INTEGER NOT NULL,
    `description` TEXT NULL,
    `emission_date` DATE NULL,
    `expiration_date` DATE NULL,
    `email_responsibility` VARCHAR(100) NULL,
    `id_pay_type` INTEGER NOT NULL,
    `id_document` INTEGER NOT NULL,
    `id_status` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `detail_invoice_invoice_number_key`(`invoice_number`),
    INDEX `detail_invoice_invoice_number_idx`(`invoice_number`),
    PRIMARY KEY (`id_detail_invoice`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `process_documents` (
    `id_process_document` INTEGER NOT NULL AUTO_INCREMENT,
    `process_code` INTEGER NOT NULL,
    `id_document` INTEGER NOT NULL,
    `observations` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `process_documents_process_code_id_document_idx`(`process_code`, `id_document`),
    PRIMARY KEY (`id_process_document`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `process_review` (
    `id_process_review` INTEGER NOT NULL AUTO_INCREMENT,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_selected` BOOLEAN NOT NULL DEFAULT false,
    `process_code` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `process_review_process_code_idx`(`process_code`),
    PRIMARY KEY (`id_process_review`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `telegram_chat` (
    `id_telegram_chat` INTEGER NOT NULL AUTO_INCREMENT,
    `chat_id` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(15) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `telegram_chat_chat_id_key`(`chat_id`),
    INDEX `telegram_chat_chat_id_idx`(`chat_id`),
    PRIMARY KEY (`id_telegram_chat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs_notification` (
    `id_logs_notification` VARCHAR(191) NOT NULL,
    `log` TEXT NOT NULL,
    `message` TEXT NOT NULL,
    `subject` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(15) NULL,
    `email` VARCHAR(100) NULL,
    `module` VARCHAR(100) NOT NULL,
    `event_type` VARCHAR(50) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `user_email` VARCHAR(100) NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `status_code` INTEGER NULL,
    `kafka_topic` VARCHAR(100) NULL,
    `correlation_id` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `logs_notification_user_id_idx`(`user_id`),
    INDEX `logs_notification_event_type_idx`(`event_type`),
    INDEX `logs_notification_created_at_idx`(`created_at`),
    INDEX `logs_notification_user_email_idx`(`user_email`),
    PRIMARY KEY (`id_logs_notification`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `access_token` (
    `id_access_token` VARCHAR(191) NOT NULL,
    `id_user` VARCHAR(191) NOT NULL,
    `type_authentication` VARCHAR(50) NOT NULL,
    `provider` VARCHAR(50) NOT NULL,
    `provider_account` VARCHAR(255) NOT NULL,
    `access_token` TEXT NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `token_type` VARCHAR(50) NOT NULL,
    `scope` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `access_token_id_user_idx`(`id_user`),
    PRIMARY KEY (`id_access_token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_token` (
    `id_refresh_token` VARCHAR(191) NOT NULL,
    `id_user` VARCHAR(191) NOT NULL,
    `id_access_token` VARCHAR(191) NULL,
    `refresh_token` VARCHAR(255) NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `refresh_token_id_user_idx`(`id_user`),
    INDEX `refresh_token_refresh_token_idx`(`refresh_token`),
    INDEX `refresh_token_id_access_token_idx`(`id_access_token`),
    PRIMARY KEY (`id_refresh_token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `revoke_token` (
    `id_revoke_token` VARCHAR(191) NOT NULL,
    `jti` VARCHAR(255) NOT NULL,
    `reason` VARCHAR(255) NULL,
    `id_user` VARCHAR(191) NULL,
    `id_access_token` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `revoke_token_jti_idx`(`jti`),
    INDEX `revoke_token_id_user_idx`(`id_user`),
    INDEX `revoke_token_id_access_token_idx`(`id_access_token`),
    PRIMARY KEY (`id_revoke_token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_id_user_type_fkey` FOREIGN KEY (`id_user_type`) REFERENCES `user_type`(`id_user_type`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_id_permission_fkey` FOREIGN KEY (`id_permission`) REFERENCES `permission`(`id_permission`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_id_user_type_fkey` FOREIGN KEY (`id_user_type`) REFERENCES `user_type`(`id_user_type`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_process_code_fkey` FOREIGN KEY (`process_code`) REFERENCES `process`(`id_process`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_id_notification_type_fkey` FOREIGN KEY (`id_notification_type`) REFERENCES `type_notification`(`id_type_notification`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_id_priority_fkey` FOREIGN KEY (`id_priority`) REFERENCES `priority`(`id_priority`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status`(`id_status`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_id_type_service_fkey` FOREIGN KEY (`id_type_service`) REFERENCES `type_service`(`id_type_service`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `status` ADD CONSTRAINT `status_id_type_status_fkey` FOREIGN KEY (`id_type_status`) REFERENCES `type_status`(`id_type_status`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `process` ADD CONSTRAINT `process_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status`(`id_status`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `process` ADD CONSTRAINT `process_id_entity_fkey` FOREIGN KEY (`id_entity`) REFERENCES `entity`(`id_entity`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document` ADD CONSTRAINT `document_id_type_document_fkey` FOREIGN KEY (`id_type_document`) REFERENCES `type_document`(`id_type_document`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document` ADD CONSTRAINT `document_process_code_fkey` FOREIGN KEY (`process_code`) REFERENCES `process`(`id_process`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document` ADD CONSTRAINT `document_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status`(`id_status`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_invoice` ADD CONSTRAINT `detail_invoice_process_code_fkey` FOREIGN KEY (`process_code`) REFERENCES `process`(`id_process`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_invoice` ADD CONSTRAINT `detail_invoice_id_pay_type_fkey` FOREIGN KEY (`id_pay_type`) REFERENCES `pay_type`(`id_pay_type`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_invoice` ADD CONSTRAINT `detail_invoice_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status`(`id_status`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_invoice` ADD CONSTRAINT `detail_invoice_id_document_fkey` FOREIGN KEY (`id_document`) REFERENCES `document`(`id_document`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_invoice` ADD CONSTRAINT `detail_invoice_id_entity_fkey` FOREIGN KEY (`id_entity`) REFERENCES `entity`(`id_entity`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `process_documents` ADD CONSTRAINT `process_documents_process_code_fkey` FOREIGN KEY (`process_code`) REFERENCES `process`(`id_process`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `process_documents` ADD CONSTRAINT `process_documents_id_document_fkey` FOREIGN KEY (`id_document`) REFERENCES `document`(`id_document`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `process_review` ADD CONSTRAINT `process_review_process_code_fkey` FOREIGN KEY (`process_code`) REFERENCES `process`(`id_process`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `access_token` ADD CONSTRAINT `access_token_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_id_access_token_fkey` FOREIGN KEY (`id_access_token`) REFERENCES `access_token`(`id_access_token`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `revoke_token` ADD CONSTRAINT `revoke_token_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `revoke_token` ADD CONSTRAINT `revoke_token_id_access_token_fkey` FOREIGN KEY (`id_access_token`) REFERENCES `access_token`(`id_access_token`) ON DELETE SET NULL ON UPDATE CASCADE;
