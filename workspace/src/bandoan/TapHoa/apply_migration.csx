using System.Data;
using MySql.Data.MySqlClient;

var connectionString = "Server=localhost;Database=TapHoaWMS;User=root;Password=12345678;AllowUserVariables=true;UseAffectedRows=false";
var scriptPath = "d:\\WORKSPACE\\Home\\web\\home\\workspace\\src\\bandoan\\TapHoa\\migrate.sql";
var script = File.ReadAllText(scriptPath);

using var connection = new MySqlConnection(connectionString);
connection.Open();
using var command = new MySqlCommand(script, connection);
command.ExecuteNonQuery();
Console.WriteLine("Migration applied successfully!");
