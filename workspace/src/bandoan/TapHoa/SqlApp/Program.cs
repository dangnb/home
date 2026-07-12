using MySqlConnector;
var c = new MySqlConnection("Server=localhost;Database=TapHoaWMS;User=root;Password=12345678;AllowUserVariables=true;UseAffectedRows=false");
c.Open();

try
{
    using var cmd = new MySqlCommand("ALTER TABLE PayrollPeriods ADD COLUMN `CustomVariables` LONGTEXT NULL;", c);
    cmd.ExecuteNonQuery();
    Console.WriteLine("CustomVariables column added.");
}
catch (Exception ex)
{
    Console.WriteLine($"CustomVariables: {ex.Message}");
}

Console.WriteLine("Done!");
