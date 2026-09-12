using MySqlConnector;

namespace HrmPlatform.WebApi.Common;

/// <summary>
/// Khởi tạo cơ sở dữ liệu MariaDB tự động nếu chưa tồn tại (Database, Tables, Seed data)
/// </summary>
public static class DatabaseInitializer
{
    public static async Task InitializeAsync(IConfiguration configuration, ILogger logger, string basePath)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Server=localhost;Port=3306;Database=hrm_platform;User=root;Password=12345678;CharSet=utf8mb4;";

        var builder = new MySqlConnectionStringBuilder(connectionString);
        var targetDb = builder.Database;

        try
        {
            // 1. Kết nối tới server (chưa chọn DB) để tạo DB nếu chưa có
            builder.Database = "";
            using (var serverConn = new MySqlConnection(builder.ConnectionString))
            {
                await serverConn.OpenAsync();
                var createDbSql = $"CREATE DATABASE IF NOT EXISTS `{targetDb}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
                using (var cmd = new MySqlCommand(createDbSql, serverConn))
                {
                    await cmd.ExecuteNonQueryAsync();
                }
                logger.LogInformation("Đã kiểm tra/khởi tạo MariaDB database: {DbName}", targetDb);
            }

            // 2. Kết nối vào target database để kiểm tra bảng
            builder.Database = targetDb;
            using (var dbConn = new MySqlConnection(builder.ConnectionString))
            {
                await dbConn.OpenAsync();

                // Tìm đường dẫn thư mục database/
                var dir = new DirectoryInfo(basePath);
                string? schemaPath = null;
                string? seedPath = null;
                while (dir != null)
                {
                    var candidateSchema = Path.Combine(dir.FullName, "database", "schema.sql");
                    if (File.Exists(candidateSchema))
                    {
                        schemaPath = candidateSchema;
                        seedPath = Path.Combine(dir.FullName, "database", "seed.sql");
                        break;
                    }
                    dir = dir.Parent;
                }

                if (File.Exists(schemaPath))
                {
                    var schemaSql = await File.ReadAllTextAsync(schemaPath);
                    using var schemaCmd = new MySqlCommand(schemaSql, dbConn);
                    await schemaCmd.ExecuteNonQueryAsync();
                    logger.LogInformation("Đã kiểm tra và cập nhật CSDL từ schema.sql!");

                    // Thêm cột status, updated_at, updated_by cho employee_job_history nếu bảng cũ chưa có
                    try
                    {
                        var alterSql1 = "ALTER TABLE `employee_job_history` ADD COLUMN `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';";
                        using var alterCmd1 = new MySqlCommand(alterSql1, dbConn);
                        await alterCmd1.ExecuteNonQueryAsync();
                    }
                    catch { /* Column already exists */ }

                    try
                    {
                        var alterSql2 = "ALTER TABLE `employee_job_history` ADD COLUMN `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6);";
                        using var alterCmd2 = new MySqlCommand(alterSql2, dbConn);
                        await alterCmd2.ExecuteNonQueryAsync();
                    }
                    catch { /* Column already exists */ }

                    try
                    {
                        var alterSql3 = "ALTER TABLE `employee_job_history` ADD COLUMN `updated_by` BIGINT DEFAULT NULL;";
                        using var alterCmd3 = new MySqlCommand(alterSql3, dbConn);
                        await alterCmd3.ExecuteNonQueryAsync();
                    }
                    catch { /* Column already exists */ }

                    try
                    {
                        var alterSql4 = "ALTER TABLE `employee_job_history` ADD COLUMN `approval_status` VARCHAR(30) NOT NULL DEFAULT 'PENDING_APPROVAL';";
                        using var alterCmd4 = new MySqlCommand(alterSql4, dbConn);
                        await alterCmd4.ExecuteNonQueryAsync();
                    }
                    catch { /* Column already exists */ }

                    try
                    {
                        var alterSql5 = "ALTER TABLE `employee_job_history` ADD COLUMN `approver_id` BIGINT DEFAULT NULL;";
                        using var alterCmd5 = new MySqlCommand(alterSql5, dbConn);
                        await alterCmd5.ExecuteNonQueryAsync();
                    }
                    catch { /* Column already exists */ }

                    try
                    {
                        var alterSql6 = "ALTER TABLE `employee_job_history` ADD COLUMN `approved_at` DATETIME(6) DEFAULT NULL;";
                        using var alterCmd6 = new MySqlCommand(alterSql6, dbConn);
                        await alterCmd6.ExecuteNonQueryAsync();
                    }
                    catch { /* Column already exists */ }

                    try
                    {
                        var alterSql7 = "ALTER TABLE `employee_job_history` ADD COLUMN `rejection_reason` VARCHAR(500) DEFAULT NULL;";
                        using var alterCmd7 = new MySqlCommand(alterSql7, dbConn);
                        await alterCmd7.ExecuteNonQueryAsync();
                    }
                    catch { /* Column already exists */ }

                    string[] stepCols = new[]
                    {
                        "ALTER TABLE `employee_job_history` ADD COLUMN `current_step` INT NOT NULL DEFAULT 1;",
                        "ALTER TABLE `employee_job_history` ADD COLUMN `current_manager_status` VARCHAR(30) DEFAULT 'PENDING';",
                        "ALTER TABLE `employee_job_history` ADD COLUMN `current_manager_note` TEXT DEFAULT NULL;",
                        "ALTER TABLE `employee_job_history` ADD COLUMN `current_manager_approved_at` DATETIME(6) DEFAULT NULL;",
                        "ALTER TABLE `employee_job_history` ADD COLUMN `new_manager_status` VARCHAR(30) DEFAULT 'PENDING';",
                        "ALTER TABLE `employee_job_history` ADD COLUMN `new_manager_note` TEXT DEFAULT NULL;",
                        "ALTER TABLE `employee_job_history` ADD COLUMN `new_manager_approved_at` DATETIME(6) DEFAULT NULL;",
                        "ALTER TABLE `employee_job_history` ADD COLUMN `hr_status` VARCHAR(30) DEFAULT 'PENDING';",
                        "ALTER TABLE `employee_job_history` ADD COLUMN `hr_note` TEXT DEFAULT NULL;",
                        "ALTER TABLE `employee_job_history` ADD COLUMN `hr_approved_at` DATETIME(6) DEFAULT NULL;",
                        "ALTER TABLE `employee_job_history` ADD COLUMN `director_status` VARCHAR(30) DEFAULT 'PENDING';",
                        "ALTER TABLE `employee_job_history` ADD COLUMN `director_note` TEXT DEFAULT NULL;",
                        "ALTER TABLE `employee_job_history` ADD COLUMN `director_approved_at` DATETIME(6) DEFAULT NULL;",
                        "ALTER TABLE `employee_job_history` ADD COLUMN `employee_ack_status` VARCHAR(30) DEFAULT 'PENDING';",
                        "ALTER TABLE `employee_job_history` ADD COLUMN `employee_ack_note` TEXT DEFAULT NULL;",
                        "ALTER TABLE `employee_job_history` ADD COLUMN `employee_acknowledged_at` DATETIME(6) DEFAULT NULL;"
                    };

                    foreach (var sql in stepCols)
                    {
                        try
                        {
                            using var stepCmd = new MySqlCommand(sql, dbConn);
                            await stepCmd.ExecuteNonQueryAsync();
                        }
                        catch { /* Column already exists */ }
                    }

                    string[] rdCols = new[]
                    {
                        "ALTER TABLE `reward_disciplines` ADD COLUMN `approver_id` BIGINT DEFAULT NULL;",
                        "ALTER TABLE `reward_disciplines` ADD COLUMN `approved_at` DATETIME(6) DEFAULT NULL;",
                        "ALTER TABLE `reward_disciplines` ADD COLUMN `rejection_reason` VARCHAR(500) DEFAULT NULL;"
                    };

                    foreach (var sql in rdCols)
                    {
                        try
                        {
                            using var rdCmd = new MySqlCommand(sql, dbConn);
                            await rdCmd.ExecuteNonQueryAsync();
                        }
                        catch { /* Column already exists */ }
                    }

                    try
                    {
                        var createRepairsTableSql = @"
                            CREATE TABLE IF NOT EXISTS `equipment_repairs` (
                                `id` BIGINT NOT NULL AUTO_INCREMENT,
                                `tenant_id` BIGINT NOT NULL,
                                `code` VARCHAR(50) NOT NULL,
                                `equipment_id` BIGINT NOT NULL,
                                `reporter_user_id` BIGINT NOT NULL,
                                `reported_date` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                                `issue_description` TEXT NOT NULL,
                                `priority` VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
                                `technician_user_id` BIGINT DEFAULT NULL,
                                `assigned_date` DATETIME(6) DEFAULT NULL,
                                `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
                                `actual_error` TEXT DEFAULT NULL,
                                `solution_detail` TEXT DEFAULT NULL,
                                `replaced_parts` TEXT DEFAULT NULL,
                                `repair_cost` DECIMAL(18,2) DEFAULT '0.00',
                                `started_at` DATETIME(6) DEFAULT NULL,
                                `completed_at` DATETIME(6) DEFAULT NULL,
                                `note` TEXT DEFAULT NULL,
                                `status_entity` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                                `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                                `created_by` BIGINT DEFAULT NULL,
                                `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
                                `updated_by` BIGINT DEFAULT NULL,
                                PRIMARY KEY (`id`),
                                UNIQUE KEY `uk_equipment_repairs_tenant_code` (`tenant_id`, `code`),
                                KEY `idx_equipment_repairs_equipment` (`tenant_id`, `equipment_id`),
                                KEY `idx_equipment_repairs_technician` (`tenant_id`, `technician_user_id`),
                                KEY `idx_equipment_repairs_status` (`tenant_id`, `status`),
                                CONSTRAINT `fk_equipment_repairs_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
                                CONSTRAINT `fk_equipment_repairs_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipments` (`id`) ON DELETE CASCADE
                            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
                        using var repairsCmd = new MySqlCommand(createRepairsTableSql, dbConn);
                        await repairsCmd.ExecuteNonQueryAsync();
                    }
                    catch (Exception ex)
                    {
                        logger.LogWarning("Notice equipment_repairs check: {Message}", ex.Message);
                    }

                    // ── Projects Module ───────────────────────────────────────────────────
                    string[] projectTableSqls = new[]
                    {
                        @"CREATE TABLE IF NOT EXISTS `projects` (
                            `id` BIGINT NOT NULL AUTO_INCREMENT,
                            `tenant_id` BIGINT NOT NULL,
                            `code` VARCHAR(30) NOT NULL,
                            `name` VARCHAR(255) NOT NULL,
                            `customer_name` VARCHAR(255) NOT NULL,
                            `customer_contact_name` VARCHAR(100) DEFAULT NULL,
                            `customer_phone` VARCHAR(20) DEFAULT NULL,
                            `customer_email` VARCHAR(100) DEFAULT NULL,
                            `sales_user_id` BIGINT NOT NULL,
                            `sales_department_id` BIGINT NOT NULL,
                            `tech_lead_user_id` BIGINT DEFAULT NULL,
                            `tech_department_id` BIGINT DEFAULT NULL,
                            `project_type` VARCHAR(30) NOT NULL DEFAULT 'FIXED_PRICE',
                            `sales_status` VARCHAR(30) NOT NULL DEFAULT 'LEAD',
                            `tech_status` VARCHAR(30) NOT NULL DEFAULT 'NOT_APPLICABLE',
                            `priority` VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
                            `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                            `quoted_value` DECIMAL(18,2) DEFAULT NULL,
                            `contract_value` DECIMAL(18,2) DEFAULT NULL,
                            `contract_signed_date` DATE DEFAULT NULL,
                            `contract_file_ref` VARCHAR(500) DEFAULT NULL,
                            `warranty_months` INT NOT NULL DEFAULT 0,
                            `warranty_end_date` DATE DEFAULT NULL,
                            `planned_start_date` DATE DEFAULT NULL,
                            `planned_end_date` DATE DEFAULT NULL,
                            `actual_start_date` DATE DEFAULT NULL,
                            `actual_end_date` DATE DEFAULT NULL,
                            `overall_progress_percent` INT NOT NULL DEFAULT 0,
                            `description` TEXT DEFAULT NULL,
                            `internal_note` TEXT DEFAULT NULL,
                            `cancelled_reason` VARCHAR(500) DEFAULT NULL,
                            `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                            `created_by` BIGINT DEFAULT NULL,
                            `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
                            `updated_by` BIGINT DEFAULT NULL,
                            PRIMARY KEY (`id`),
                            UNIQUE KEY `uk_projects_tenant_code` (`tenant_id`, `code`),
                            KEY `idx_projects_sales_status` (`tenant_id`, `sales_status`),
                            KEY `idx_projects_tech_status` (`tenant_id`, `tech_status`),
                            CONSTRAINT `fk_projects_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
                            CONSTRAINT `fk_projects_sales_user` FOREIGN KEY (`sales_user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

                        @"CREATE TABLE IF NOT EXISTS `project_milestones` (
                            `id` BIGINT NOT NULL AUTO_INCREMENT,
                            `project_id` BIGINT NOT NULL,
                            `title` VARCHAR(200) NOT NULL,
                            `description` TEXT DEFAULT NULL,
                            `sort_order` INT NOT NULL DEFAULT 0,
                            `due_date` DATE DEFAULT NULL,
                            `milestone_status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                            `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                            `payment_percent` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
                            `payment_amount` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
                            `is_payment_received` TINYINT(1) NOT NULL DEFAULT 0,
                            `completed_date` DATE DEFAULT NULL,
                            `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                            `created_by` BIGINT DEFAULT NULL,
                            `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
                            `updated_by` BIGINT DEFAULT NULL,
                            PRIMARY KEY (`id`),
                            KEY `idx_milestones_project` (`project_id`),
                            CONSTRAINT `fk_milestones_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

                        @"CREATE TABLE IF NOT EXISTS `project_tasks` (
                            `id` BIGINT NOT NULL AUTO_INCREMENT,
                            `project_id` BIGINT NOT NULL,
                            `milestone_id` BIGINT DEFAULT NULL,
                            `title` VARCHAR(255) NOT NULL,
                            `description` TEXT DEFAULT NULL,
                            `assignee_user_id` BIGINT DEFAULT NULL,
                            `assigned_by_user_id` BIGINT DEFAULT NULL,
                            `task_type` VARCHAR(30) NOT NULL DEFAULT 'DEVELOPMENT',
                            `priority` VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
                            `task_status` VARCHAR(20) NOT NULL DEFAULT 'TODO',
                            `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                            `estimated_hours` DECIMAL(8,2) NOT NULL DEFAULT 0.00,
                            `actual_hours` DECIMAL(8,2) NOT NULL DEFAULT 0.00,
                            `progress_percent` INT NOT NULL DEFAULT 0,
                            `start_date` DATE DEFAULT NULL,
                            `due_date` DATE DEFAULT NULL,
                            `completed_date` DATE DEFAULT NULL,
                            `blocked_reason` VARCHAR(500) DEFAULT NULL,
                            `tags` VARCHAR(255) DEFAULT NULL,
                            `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                            `created_by` BIGINT DEFAULT NULL,
                            `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
                            `updated_by` BIGINT DEFAULT NULL,
                            PRIMARY KEY (`id`),
                            KEY `idx_tasks_project` (`project_id`),
                            KEY `idx_tasks_milestone` (`milestone_id`),
                            KEY `idx_tasks_assignee` (`assignee_user_id`),
                            CONSTRAINT `fk_tasks_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
                            CONSTRAINT `fk_tasks_milestone` FOREIGN KEY (`milestone_id`) REFERENCES `project_milestones` (`id`) ON DELETE SET NULL,
                            CONSTRAINT `fk_tasks_assignee` FOREIGN KEY (`assignee_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

                        @"CREATE TABLE IF NOT EXISTS `project_members` (
                            `id` BIGINT NOT NULL AUTO_INCREMENT,
                            `project_id` BIGINT NOT NULL,
                            `user_id` BIGINT NOT NULL,
                            `role` VARCHAR(50) NOT NULL,
                            `joined_date` DATE NOT NULL,
                            `left_date` DATE DEFAULT NULL,
                            `note` VARCHAR(500) DEFAULT NULL,
                            `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                            `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                            `created_by` BIGINT DEFAULT NULL,
                            `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
                            `updated_by` BIGINT DEFAULT NULL,
                            PRIMARY KEY (`id`),
                            KEY `idx_members_project` (`project_id`),
                            KEY `idx_members_user` (`user_id`),
                            CONSTRAINT `fk_members_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
                            CONSTRAINT `fk_members_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
                    };

                    foreach (var tableSql in projectTableSqls)
                    {
                        try
                        {
                            using var cmd = new MySqlCommand(tableSql, dbConn);
                            await cmd.ExecuteNonQueryAsync();
                        }
                        catch (Exception ex)
                        {
                            logger.LogWarning("Notice project table creation: {Message}", ex.Message);
                        }
                    }
                    logger.LogInformation("Đã kiểm tra/tạo các bảng Projects module.");

                    // ── Project Documents ─────────────────────────────────────────────────
                    try
                    {
                        var createDocsSql = @"CREATE TABLE IF NOT EXISTS `project_documents` (
                            `id` BIGINT NOT NULL AUTO_INCREMENT,
                            `project_id` BIGINT NOT NULL,
                            `file_name` VARCHAR(255) NOT NULL,
                            `document_type` VARCHAR(30) NOT NULL DEFAULT 'OTHER',
                            `description` VARCHAR(500) DEFAULT NULL,
                            `stored_path` VARCHAR(1000) NOT NULL,
                            `file_size_bytes` BIGINT NOT NULL DEFAULT 0,
                            `mime_type` VARCHAR(100) NOT NULL DEFAULT 'application/octet-stream',
                            `uploaded_by` BIGINT DEFAULT NULL,
                            `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                            `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                            PRIMARY KEY (`id`),
                            KEY `idx_proj_docs_project` (`project_id`),
                            CONSTRAINT `fk_proj_docs_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
                        using var docsCmd = new MySqlCommand(createDocsSql, dbConn);
                        await docsCmd.ExecuteNonQueryAsync();
                        logger.LogInformation("Đã kiểm tra/tạo bảng project_documents.");
                    }
                    catch (Exception ex)
                    {
                        logger.LogWarning("Notice project_documents: {Message}", ex.Message);
                    }
                }



                if (File.Exists(seedPath))
                {
                    var seedSql = await File.ReadAllTextAsync(seedPath);
                    using var seedCmd = new MySqlCommand(seedSql, dbConn);
                    await seedCmd.ExecuteNonQueryAsync();
                    logger.LogInformation("Đã kiểm tra và seed dữ liệu từ seed.sql!");
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Lỗi khi tự động khởi tạo cơ sở dữ liệu MariaDB: {Message}", ex.Message);
        }
    }
}
