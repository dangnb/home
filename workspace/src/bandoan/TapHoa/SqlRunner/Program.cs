using System;
using System.IO;
using MySqlConnector;

namespace SqlRunner
{
    class Program
    {
        static void Main(string[] args)
        {
            var cs = "Server=localhost;Database=TapHoaWMS;User=root;Password=12345678;AllowUserVariables=true;UseAffectedRows=false;AllowLoadLocalInfile=true";
            using var conn = new MySqlConnection(cs);
            conn.Open();
            var sql = File.ReadAllText(@"d:\WORKSPACE\Home\web\home\workspace\src\bandoan\TapHoa\patch.sql");
            var cmd = new MySqlCommand(@"
                DROP TABLE IF EXISTS `Employees`;
                CREATE TABLE `Employees` (
                    `Id` char(36) NOT NULL,
                    `EmployeeCode` longtext NOT NULL,
                    `FullName` longtext NOT NULL,
                    `PhoneNumber` longtext NULL,
                    `CitizenId` longtext NULL,
                    `Address` longtext NULL,
                    `DateOfBirth` datetime(6) NULL,
                    `Gender` longtext NULL,
                    `BaseSalary` decimal(18,2) NOT NULL,
                    `SalaryTemplateId` char(36) NULL,
                    `DepartmentId` char(36) NULL,
                    `PositionId` char(36) NULL,
                    `UserId` char(36) NULL,
                    `CompanyId` char(36) NOT NULL,
                    `CreatedDate` datetime(6) NULL,
                    `CreatedBy` longtext NULL,
                    `ModifiedDate` datetime(6) NULL,
                    `ModifiedBy` longtext NULL,
                    `IsDeleted` tinyint(1) NOT NULL,
                    `DeletedDate` datetime(6) NULL,
                    `DeletedBy` longtext NULL,
                    PRIMARY KEY (`Id`)
                );
            ", conn);
            cmd.ExecuteNonQuery();
            Console.WriteLine("Employees created.");

            var cmd2 = new MySqlCommand("SELECT MigrationId FROM __efmigrationshistory ORDER BY MigrationId DESC LIMIT 5;", conn);
            using var reader = cmd2.ExecuteReader();
            Console.WriteLine("Migrations:");
            while(reader.Read()) Console.WriteLine(reader.GetString(0));

            var fks = new string[] {
                "ALTER TABLE Employees ADD CONSTRAINT FK_Emp_Dept FOREIGN KEY (DepartmentId) REFERENCES departments (Id);",
                "ALTER TABLE Employees ADD CONSTRAINT FK_Emp_Pos FOREIGN KEY (PositionId) REFERENCES positions (Id);",
                "ALTER TABLE Employees ADD CONSTRAINT FK_Emp_Sal FOREIGN KEY (SalaryTemplateId) REFERENCES salarytemplates (Id);",
                "ALTER TABLE Employees ADD CONSTRAINT FK_Emp_User FOREIGN KEY (UserId) REFERENCES users (Id);"
            };

            foreach(var fk in fks) {
                try {
                    new MySqlCommand(fk, conn).ExecuteNonQuery();
                    Console.WriteLine("Success: " + fk);
                } catch (Exception ex) {
                    Console.WriteLine("Failed: " + fk + " => " + ex.Message);
                }
            }


            Console.WriteLine("Done executing script!");
        }
    }
}
