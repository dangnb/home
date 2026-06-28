using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TapHoa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomerEmailAndBank : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BankAccountNumber",
                table: "Customers",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BankName",
                table: "Customers",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Customers",
                type: "longtext",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BankAccountNumber",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "BankName",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Customers");
        }
    }
}
