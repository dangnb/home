using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TapHoa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSupplierEmailAndBank : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BankAccountNumber",
                table: "Suppliers",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BankName",
                table: "Suppliers",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Suppliers",
                type: "longtext",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BankAccountNumber",
                table: "Suppliers");

            migrationBuilder.DropColumn(
                name: "BankName",
                table: "Suppliers");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Suppliers");
        }
    }
}
