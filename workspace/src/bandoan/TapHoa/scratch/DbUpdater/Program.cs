using System;
using System.IO;
using MySqlConnector;

class Program
{
    static void Main()
    {
        string sqlPath = @"E:\Word_Space\job-out\workspace\src\bandoan\TapHoa\update2.sql";
        string sql = File.ReadAllText(sqlPath);
        
        string connectionString = "Server=localhost;Database=TapHoaWMS;User=root;Password=12345678;AllowUserVariables=true;UseAffectedRows=false;";
        using var connection = new MySqlConnection(connectionString);
        connection.Open();
        
        using var command = new MySqlCommand(sql, connection);
        int rowsAffected = command.ExecuteNonQuery();
        
        Console.WriteLine($"SQL executed successfully! Rows affected: {rowsAffected}");
    }
}
