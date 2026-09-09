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

                // Kiểm tra xem bảng tenants đã tồn tại chưa
                var checkTableSql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = @db AND table_name = 'tenants';";
                using (var checkCmd = new MySqlCommand(checkTableSql, dbConn))
                {
                    checkCmd.Parameters.AddWithValue("@db", targetDb);
                    var count = Convert.ToInt32(await checkCmd.ExecuteScalarAsync());

                    if (count == 0)
                    {
                        logger.LogInformation("Database chưa có schema. Đang tiến hành thực thi schema.sql và seed.sql...");

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
                            logger.LogInformation("Đã thực thi thành công schema.sql!");
                        }

                        if (File.Exists(seedPath))
                        {
                            var seedSql = await File.ReadAllTextAsync(seedPath);
                            using var seedCmd = new MySqlCommand(seedSql, dbConn);
                            await seedCmd.ExecuteNonQueryAsync();
                            logger.LogInformation("Đã thực thi thành công seed.sql!");
                        }
                    }
                    else
                    {
                        logger.LogInformation("Database {DbName} đã có sẵn schema hợp lệ.", targetDb);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Lỗi khi tự động khởi tạo cơ sở dữ liệu MariaDB: {Message}", ex.Message);
        }
    }
}
