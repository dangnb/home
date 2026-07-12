using System;
using System.Data;
using MySqlConnector;

class Program
{
    static void Main(string[] args)
    {
        string connectionString = "Server=localhost;Database=TapHoaWMS;User=root;Password=12345678;AllowUserVariables=true;UseAffectedRows=false;";
        using var connection = new MySqlConnection(connectionString);
        connection.Open();

        try
        {
            var sql = System.IO.File.ReadAllText(@"e:\Word_Space\job-out\workspace\src\bandoan\TapHoa\update.sql");
            var script = new MySqlScript(connection, sql);
            script.Execute();
            Console.WriteLine("Database updated successfully from update.sql");
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error updating database: " + ex.Message);
        }
    }
}
