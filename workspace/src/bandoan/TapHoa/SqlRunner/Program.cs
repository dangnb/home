using System;
using System.IO;
using MySqlConnector;

namespace SqlRunner
{
    class Program
    {
        static void Main(string[] args)
        {
            var cs = "Server=localhost;Database=TapHoaWMS;User=root;Password=12345678;AllowUserVariables=true;UseAffectedRows=false";
            using var conn = new MySqlConnection(cs);
            conn.Open();
            
            var cmd1 = new MySqlCommand("ALTER TABLE Customers ADD COLUMN Tier INT NOT NULL DEFAULT 0; ALTER TABLE Customers ADD COLUMN TotalAccumulatedPoints INT NOT NULL DEFAULT 0;", conn);
            try { cmd1.ExecuteNonQuery(); Console.WriteLine("Customers updated"); } catch (Exception e) { Console.WriteLine(e.Message); }

            var cmd2 = new MySqlCommand("ALTER TABLE Orders ADD COLUMN PointsUsed INT NOT NULL DEFAULT 0; ALTER TABLE Orders ADD COLUMN PointDiscountAmount DECIMAL(18,2) NOT NULL DEFAULT 0; ALTER TABLE Orders ADD COLUMN PointsEarned INT NOT NULL DEFAULT 0;", conn);
            try { cmd2.ExecuteNonQuery(); Console.WriteLine("Orders updated"); } catch (Exception e) { Console.WriteLine(e.Message); }

            // Add migration to EF history manually to prevent issues
            var cmd3 = new MySqlCommand("INSERT IGNORE INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`) VALUES ('20240101000000_AddLoyaltyMembership', '8.0.2');", conn);
            try { cmd3.ExecuteNonQuery(); } catch {}

            Console.WriteLine("Done!");
        }
    }
}
