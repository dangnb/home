using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TapHoa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMinMaxStockLevelToProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaxStockLevel",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MinStockLevel",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "SupplierId",
                table: "Products",
                type: "char(36)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CustomerDebtTransactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    CustomerId = table.Column<Guid>(type: "char(36)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaidAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Note = table.Column<string>(type: "longtext", nullable: true),
                    RelatedDebtId = table.Column<Guid>(type: "char(36)", nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
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
                    table.PrimaryKey("PK_CustomerDebtTransactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerDebtTransactions_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SupplierDebts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    SupplierId = table.Column<Guid>(type: "char(36)", nullable: false),
                    SupplierName = table.Column<string>(type: "longtext", nullable: false),
                    PhoneNumber = table.Column<string>(type: "longtext", nullable: true),
                    TotalDebt = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
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
                    table.PrimaryKey("PK_SupplierDebts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SupplierDebts_Suppliers_SupplierId",
                        column: x => x.SupplierId,
                        principalTable: "Suppliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SupplierDebtTransactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    SupplierId = table.Column<Guid>(type: "char(36)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaidAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Note = table.Column<string>(type: "longtext", nullable: true),
                    RelatedDebtId = table.Column<Guid>(type: "char(36)", nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
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
                    table.PrimaryKey("PK_SupplierDebtTransactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SupplierDebtTransactions_Suppliers_SupplierId",
                        column: x => x.SupplierId,
                        principalTable: "Suppliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000002001"),
                columns: new[] { "MaxStockLevel", "MinStockLevel", "SupplierId" },
                values: new object[] { 200, 10, null });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000002002"),
                columns: new[] { "MaxStockLevel", "MinStockLevel", "SupplierId" },
                values: new object[] { 0, 0, null });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000002003"),
                columns: new[] { "MaxStockLevel", "MinStockLevel", "SupplierId" },
                values: new object[] { 50, 10, null });

            migrationBuilder.CreateIndex(
                name: "IX_Products_SupplierId",
                table: "Products",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerDebtTransactions_CustomerId",
                table: "CustomerDebtTransactions",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_SupplierDebts_SupplierId",
                table: "SupplierDebts",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_SupplierDebtTransactions_SupplierId",
                table: "SupplierDebtTransactions",
                column: "SupplierId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Suppliers_SupplierId",
                table: "Products",
                column: "SupplierId",
                principalTable: "Suppliers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Suppliers_SupplierId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "CustomerDebtTransactions");

            migrationBuilder.DropTable(
                name: "SupplierDebts");

            migrationBuilder.DropTable(
                name: "SupplierDebtTransactions");

            migrationBuilder.DropIndex(
                name: "IX_Products_SupplierId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MaxStockLevel",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MinStockLevel",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "SupplierId",
                table: "Products");
        }
    }
}
