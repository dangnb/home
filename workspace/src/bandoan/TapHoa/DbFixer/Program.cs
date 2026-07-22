using System;
using MySql.Data.MySqlClient;
using Dapper;

namespace DbFixer
{
    class Program
    {
        static void Main(string[] args)
        {
            var connectionString = "Server=localhost;Database=TapHoaWMS;User=root;Password=12345678;AllowUserVariables=true;UseAffectedRows=false";
            using var conn = new MySqlConnection(connectionString);
            conn.Open();

            var newHash = BCrypt.Net.BCrypt.HashPassword("123456");
            conn.Execute("UPDATE Users SET PasswordHash = @Hash WHERE Username = 'admin'", new { Hash = newHash });

            var createTableSql = @"
                CREATE TABLE IF NOT EXISTS Notifications (
                    Id CHAR(36) NOT NULL PRIMARY KEY,
                    Title VARCHAR(255) NOT NULL,
                    Message TEXT NOT NULL,
                    Type INT NOT NULL,
                    Priority INT NOT NULL,
                    TargetUsername VARCHAR(100) NULL,
                    IsRead TINYINT(1) NOT NULL DEFAULT 0,
                    ReadAt DATETIME(6) NULL,
                    ActionUrl VARCHAR(500) NULL,
                    ReferenceId VARCHAR(100) NULL,
                    CreatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                    CreatedBy VARCHAR(100) NULL,
                    LastModifiedAt DATETIME(6) NULL,
                    LastModifiedBy VARCHAR(100) NULL,
                    IsDeleted TINYINT(1) NOT NULL DEFAULT 0
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

            conn.Execute(createTableSql);

            Console.WriteLine($"Successfully ensured Notifications table exists and updated admin password!");
        }
    }
}
