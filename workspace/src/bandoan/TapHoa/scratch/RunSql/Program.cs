using System;
using System.IO;
using MySqlConnector;

class Program
{
    static void Main()
    {
        string connectionString = "Server=localhost;Database=TapHoaWMS;User=root;Password=12345678;AllowUserVariables=true;UseAffectedRows=false";
        string scriptPath = @"e:\Word_Space\job-out\workspace\src\bandoan\TapHoa\TapHoa.API\update3.sql";
        
        try
        {
            string sqlScript = File.ReadAllText(scriptPath);
            using (var connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                using (var command = new MySqlCommand(sqlScript, connection))
                {
                    int rows = command.ExecuteNonQuery();
                    Console.WriteLine($"Successfully executed the migration script! (Rows affected: {rows})");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }
    }
}
