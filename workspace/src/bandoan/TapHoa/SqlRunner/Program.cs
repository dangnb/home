using MySqlConnector;
using System.IO;
using System;

using var connMaster = new MySqlConnection("Server=localhost;User=root;Password=12345678;AllowUserVariables=true;UseAffectedRows=false;AllowLoadLocalInfile=true");
connMaster.Open();

using (var cmdDrop = new MySqlCommand("DROP DATABASE IF EXISTS TapHoaWMS; CREATE DATABASE TapHoaWMS;", connMaster))
{
    cmdDrop.ExecuteNonQuery();
}
Console.WriteLine("Database recreated.");

using var conn = new MySqlConnection("Server=localhost;Database=TapHoaWMS;User=root;Password=12345678;AllowUserVariables=true;UseAffectedRows=false;AllowLoadLocalInfile=true");
conn.Open();

var scriptDb = File.ReadAllText("full_schema.sql");
scriptDb = scriptDb.Replace("'Đang bán'", "'0'");
scriptDb = scriptDb.Replace("'Sắp hết'", "'0'");
scriptDb = scriptDb.Replace("'Ngừng kinh doanh'", "'1'");

using (var cmd = new MySqlCommand(scriptDb, conn))
{
    cmd.ExecuteNonQuery();
}
Console.WriteLine("full_schema.sql executed.");
