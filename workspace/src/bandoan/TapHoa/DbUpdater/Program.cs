using System;
using MySql.Data.MySqlClient;

namespace DbUpdater
{
    class Program
    {
        static void Main(string[] args)
        {
            string connectionString = "Server=localhost;Database=TapHoaWMS;User=root;Password=12345678;AllowUserVariables=true;UseAffectedRows=false";
            
            using (var connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                
                string supplierId = "";
                using (var cmd = new MySqlCommand("SELECT Id FROM suppliers LIMIT 1", connection))
                {
                    var result = cmd.ExecuteScalar();
                    if (result != null) supplierId = result.ToString();
                }

                if (string.IsNullOrEmpty(supplierId))
                {
                    supplierId = Guid.NewGuid().ToString();
                    using (var cmd = new MySqlCommand("INSERT INTO suppliers (Id, FullName, CreatedDate, IsDeleted, CompanyId) VALUES (@id, 'Nha cung cap test', NOW(), 0, '00000000-0000-0000-0000-000000000000')", connection))
                    {
                        cmd.Parameters.AddWithValue("@id", supplierId);
                        cmd.ExecuteNonQuery();
                    }
                }

                string poId = Guid.NewGuid().ToString();
                string sql = "INSERT INTO purchaseorders (Id, OrderCode, SupplierId, OrderDate, TotalAmount, AmountPaid, Status, IsDeleted, CreatedDate, CompanyId) VALUES (@id, 'PO-TEST', @supplierId, NOW(), 100000, 0, 0, 0, NOW(), '00000000-0000-0000-0000-000000000000')";
                using (var cmd = new MySqlCommand(sql, connection))
                {
                    cmd.Parameters.AddWithValue("@id", poId);
                    cmd.Parameters.AddWithValue("@supplierId", supplierId);
                    int count = cmd.ExecuteNonQuery();
                    Console.WriteLine($"Inserted {count} PurchaseOrder.");
                }
            }
        }
    }
}
