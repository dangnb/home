using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TapHoa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStockTake : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StockTakes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    DocumentNo = table.Column<string>(type: "longtext", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "longtext", nullable: true),
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
                    table.PrimaryKey("PK_StockTakes", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "StockTakeLines",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    StockTakeId = table.Column<Guid>(type: "char(36)", nullable: false),
                    ProductId = table.Column<Guid>(type: "char(36)", nullable: false),
                    ExpectedQuantity = table.Column<int>(type: "int", nullable: false),
                    ActualQuantity = table.Column<int>(type: "int", nullable: true),
                    Reason = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockTakeLines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockTakeLines_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StockTakeLines_StockTakes_StockTakeId",
                        column: x => x.StockTakeId,
                        principalTable: "StockTakes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_StockTakeLines_ProductId",
                table: "StockTakeLines",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_StockTakeLines_StockTakeId",
                table: "StockTakeLines",
                column: "StockTakeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StockTakeLines");

            migrationBuilder.DropTable(
                name: "StockTakes");
        }
    }
}
