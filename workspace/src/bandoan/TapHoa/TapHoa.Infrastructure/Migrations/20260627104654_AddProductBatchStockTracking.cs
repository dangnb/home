using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TapHoa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductBatchStockTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ProductBatches",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "StockQuantity",
                table: "ProductBatches",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "ProductBatchId",
                table: "InventoryTransactionLines",
                type: "char(36)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_InventoryTransactionLines_ProductBatchId",
                table: "InventoryTransactionLines",
                column: "ProductBatchId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryTransactionLines_ProductBatches_ProductBatchId",
                table: "InventoryTransactionLines",
                column: "ProductBatchId",
                principalTable: "ProductBatches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryTransactionLines_ProductBatches_ProductBatchId",
                table: "InventoryTransactionLines");

            migrationBuilder.DropIndex(
                name: "IX_InventoryTransactionLines_ProductBatchId",
                table: "InventoryTransactionLines");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ProductBatches");

            migrationBuilder.DropColumn(
                name: "StockQuantity",
                table: "ProductBatches");

            migrationBuilder.DropColumn(
                name: "ProductBatchId",
                table: "InventoryTransactionLines");
        }
    }
}
