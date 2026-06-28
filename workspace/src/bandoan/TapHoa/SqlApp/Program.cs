using MySqlConnector;
var c = new MySqlConnection("Server=localhost;Database=TapHoaWMS;User=root;Password=12345678;AllowUserVariables=true;UseAffectedRows=false");
c.Open();
using var cmd = new MySqlCommand(System.IO.File.ReadAllText("../add_supplier_id_to_product.sql"), c);
cmd.ExecuteNonQuery();
Console.WriteLine("Database migration updated.");
