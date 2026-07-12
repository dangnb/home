using System;
using System.IO;
using MySql.Data.MySqlClient;

namespace DbUpdater
{
    class Program
    {
        static void Main(string[] args)
        {
            string connectionString = "Server=localhost;Database=TapHoaWMS;User=root;Password=12345678;AllowUserVariables=true;UseAffectedRows=false";
            string sqlFile = @"E:\Word_Space\job-out\workspace\src\bandoan\TapHoa\purchase_orders.sql";

            string sql = File.ReadAllText(sqlFile);

            using (var connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                
                var script = new MySqlScript(connection, sql);
                int count = script.Execute();
                Console.WriteLine($"Executed {count} statements.");
            }
        }
    }
}
