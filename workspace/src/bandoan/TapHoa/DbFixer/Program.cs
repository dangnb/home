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

            Console.WriteLine($"Successfully updated admin password hash for password '123456'! Hash: {newHash}");
        }
    }
}
