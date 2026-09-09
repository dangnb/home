using MySqlConnector;
using Xunit;

namespace HrmPlatform.Infrastructure.Tests;

public class MariaDbConnectionTests
{
    private const string ConnectionString = "Server=localhost;Port=3306;Database=hrm_platform;User=root;Password=12345678;CharSet=utf8mb4;";

    [Fact]
    public async Task CanConnectToLocalMariaDbAndInitializeSchema()
    {
        var builder = new MySqlConnectionStringBuilder(ConnectionString);
        var targetDb = builder.Database;

        // 1. Kết nối không chỉ định DB để kiểm tra server & tạo database
        builder.Database = "";
        using (var conn = new MySqlConnection(builder.ConnectionString))
        {
            await conn.OpenAsync();
            Assert.True(conn.State == System.Data.ConnectionState.Open);

            using var cmd = new MySqlCommand($"CREATE DATABASE IF NOT EXISTS `{targetDb}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;", conn);
            await cmd.ExecuteNonQueryAsync();
        }

        // 2. Kết nối vào database hrm_platform
        builder.Database = targetDb;
        using (var dbConn = new MySqlConnection(builder.ConnectionString))
        {
            await dbConn.OpenAsync();
            Assert.True(dbConn.State == System.Data.ConnectionState.Open);

            // Tìm đường dẫn thư mục database/
            var dir = new DirectoryInfo(AppContext.BaseDirectory);
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

            Assert.True(File.Exists(schemaPath), $"Không tìm thấy schema.sql từ {AppContext.BaseDirectory}");
            Assert.True(File.Exists(seedPath), $"Không tìm thấy seed.sql từ {AppContext.BaseDirectory}");

            // Thực thi schema.sql
            var schemaSql = await File.ReadAllTextAsync(schemaPath);
            using (var schemaCmd = new MySqlCommand(schemaSql, dbConn))
            {
                await schemaCmd.ExecuteNonQueryAsync();
            }

            // Thực thi seed.sql
            var seedSql = await File.ReadAllTextAsync(seedPath);
            using (var seedCmd = new MySqlCommand(seedSql, dbConn))
            {
                await seedCmd.ExecuteNonQueryAsync();
            }

            // 3. Kiểm tra các bảng đã tạo thành công
            var checkTablesCmd = new MySqlCommand("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = @db;", dbConn);
            checkTablesCmd.Parameters.AddWithValue("@db", targetDb);
            var tableCount = Convert.ToInt32(await checkTablesCmd.ExecuteScalarAsync());
            Assert.True(tableCount >= 12, $"Số lượng bảng kỳ vọng >= 12, thực tế: {tableCount}");

            // 4. Kiểm tra tài khoản SuperAdmin đã được nạp
            var checkAdminCmd = new MySqlCommand("SELECT username, email FROM users WHERE id = 1;", dbConn);
            using var reader = await checkAdminCmd.ExecuteReaderAsync();
            Assert.True(await reader.ReadAsync());
            Assert.Equal("superadmin", reader.GetString(0));
            Assert.Equal("superadmin@hrmplatform.local", reader.GetString(1));
        }
    }
}
