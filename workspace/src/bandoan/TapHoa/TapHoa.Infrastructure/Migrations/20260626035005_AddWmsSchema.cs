using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TapHoa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWmsSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_StockLevels",
                table: "StockLevels");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "StockLevels",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "BatchId",
                table: "StockLevels",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LocationId",
                table: "StockLevels",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReservedQuantity",
                table: "StockLevels",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "StockLevels",
                type: "BLOB",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddPrimaryKey(
                name: "PK_StockLevels",
                table: "StockLevels",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "ProductBatches",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ProductId = table.Column<Guid>(type: "TEXT", nullable: false),
                    BatchNumber = table.Column<string>(type: "TEXT", nullable: false),
                    MfgDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ModifiedBy = table.Column<string>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    DeletedDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DeletedBy = table.Column<string>(type: "TEXT", nullable: true),
                    CompanyId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductBatches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductBatches_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WarehouseLocations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Zone = table.Column<string>(type: "TEXT", nullable: false),
                    Aisle = table.Column<string>(type: "TEXT", nullable: false),
                    Rack = table.Column<string>(type: "TEXT", nullable: false),
                    Bin = table.Column<string>(type: "TEXT", nullable: false),
                    Barcode = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ModifiedBy = table.Column<string>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    DeletedDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DeletedBy = table.Column<string>(type: "TEXT", nullable: true),
                    CompanyId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WarehouseLocations", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000000004"),
                column: "PasswordHash",
                value: "$2a$11$8rpnI.9n7caa2N3lLrkVeOyfSDUH1LlRGHt4.64Z6c0uGaFs8q0xy");

            migrationBuilder.CreateIndex(
                name: "IX_StockLevels_BatchId",
                table: "StockLevels",
                column: "BatchId");

            migrationBuilder.CreateIndex(
                name: "IX_StockLevels_LocationId",
                table: "StockLevels",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_StockLevels_ProductId_LocationId_BatchId",
                table: "StockLevels",
                columns: new[] { "ProductId", "LocationId", "BatchId" });

            migrationBuilder.CreateIndex(
                name: "IX_ProductBatches_ProductId",
                table: "ProductBatches",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_StockLevels_ProductBatches_BatchId",
                table: "StockLevels",
                column: "BatchId",
                principalTable: "ProductBatches",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StockLevels_WarehouseLocations_LocationId",
                table: "StockLevels",
                column: "LocationId",
                principalTable: "WarehouseLocations",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockLevels_ProductBatches_BatchId",
                table: "StockLevels");

            migrationBuilder.DropForeignKey(
                name: "FK_StockLevels_WarehouseLocations_LocationId",
                table: "StockLevels");

            migrationBuilder.DropTable(
                name: "ProductBatches");

            migrationBuilder.DropTable(
                name: "WarehouseLocations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StockLevels",
                table: "StockLevels");

            migrationBuilder.DropIndex(
                name: "IX_StockLevels_BatchId",
                table: "StockLevels");

            migrationBuilder.DropIndex(
                name: "IX_StockLevels_LocationId",
                table: "StockLevels");

            migrationBuilder.DropIndex(
                name: "IX_StockLevels_ProductId_LocationId_BatchId",
                table: "StockLevels");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "StockLevels");

            migrationBuilder.DropColumn(
                name: "BatchId",
                table: "StockLevels");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "StockLevels");

            migrationBuilder.DropColumn(
                name: "ReservedQuantity",
                table: "StockLevels");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "StockLevels");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StockLevels",
                table: "StockLevels",
                columns: new[] { "ProductId", "StoreId" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000000004"),
                column: "PasswordHash",
                value: "$2a$11$90Xb.I39c65h/T9qWn.2IuTksr6Kx7Oa6Jt4i57l.P6z0uLWe21M6");
        }
    }
}
