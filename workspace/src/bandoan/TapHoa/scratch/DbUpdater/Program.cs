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
            using var killCommand = new MySqlCommand("KILL 11", connection);
            killCommand.ExecuteNonQuery();
            Console.WriteLine("Killed process 11");
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error killing process 11: " + ex.Message);
        }
    }
}
