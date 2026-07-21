using System.Data;
using MySql.Data.MySqlClient;
using Dapper;

var connectionString = "Server=localhost;Database=TapHoaWMS;User=root;Password=12345678;AllowUserVariables=true;UseAffectedRows=false";

using var connection = new MySqlConnection(connectionString);
connection.Open();

try {
    connection.Execute("ALTER TABLE Categories ADD Slug varchar(255) NULL;");
    Console.WriteLine("Added Slug column to Categories table.");
} catch (Exception ex) {
    Console.WriteLine("Error adding Slug: " + ex.Message);
}

try {
    connection.Execute("UPDATE Categories SET Slug = LOWER(REPLACE(Name, ' ', '-')) WHERE Slug IS NULL;");
    Console.WriteLine("Backfilled missing Slugs for Categories.");
} catch (Exception ex) {
    Console.WriteLine("Error backfilling Slug: " + ex.Message);
}
