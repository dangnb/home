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
