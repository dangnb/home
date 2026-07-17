using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TapHoa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSalaryTemplates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "BaseSalary",
                table: "Users",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "SalaryTemplateId",
                table: "Users",
                type: "char(36)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomVariables",
                table: "PayrollPeriods",
                type: "longtext",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SalaryTemplates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Name = table.Column<string>(type: "longtext", nullable: false),
                    Formula = table.Column<string>(type: "longtext", nullable: false),
                    Notes = table.Column<string>(type: "longtext", nullable: true),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CreatedBy = table.Column<string>(type: "longtext", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ModifiedBy = table.Column<string>(type: "longtext", nullable: true),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DeletedDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DeletedBy = table.Column<string>(type: "longtext", nullable: true),
                    CompanyId = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalaryTemplates", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000000004"),
                columns: new[] { "BaseSalary", "SalaryTemplateId" },
                values: new object[] { 10000000m, null });

            migrationBuilder.CreateIndex(
                name: "IX_Users_SalaryTemplateId",
                table: "Users",
                column: "SalaryTemplateId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_SalaryTemplates_SalaryTemplateId",
                table: "Users",
                column: "SalaryTemplateId",
                principalTable: "SalaryTemplates",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_SalaryTemplates_SalaryTemplateId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "SalaryTemplates");

            migrationBuilder.DropIndex(
                name: "IX_Users_SalaryTemplateId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "BaseSalary",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SalaryTemplateId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CustomVariables",
                table: "PayrollPeriods");
        }
    }
}
