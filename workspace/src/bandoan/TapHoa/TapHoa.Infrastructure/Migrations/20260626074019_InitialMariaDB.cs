using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TapHoa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialMariaDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Action = table.Column<string>(type: "longtext", nullable: false),
                    RequestName = table.Column<string>(type: "longtext", nullable: false),
                    RequestData = table.Column<string>(type: "longtext", nullable: false),
                    Username = table.Column<string>(type: "longtext", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Name = table.Column<string>(type: "longtext", nullable: false),
                    Description = table.Column<string>(type: "longtext", nullable: false),
                    Icon = table.Column<string>(type: "longtext", nullable: false),
                    ParentId = table.Column<Guid>(type: "char(36)", nullable: true),
                    ParentCategoryId = table.Column<Guid>(type: "char(36)", nullable: true),
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
                    table.PrimaryKey("PK_Categories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Categories_Categories_ParentCategoryId",
                        column: x => x.ParentCategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "InventoryTransactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Code = table.Column<string>(type: "longtext", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ReferenceId = table.Column<string>(type: "longtext", nullable: false),
                    Notes = table.Column<string>(type: "longtext", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatedBy = table.Column<string>(type: "longtext", nullable: false),
                    ApprovedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ApprovedBy = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryTransactions", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Name = table.Column<string>(type: "longtext", nullable: false),
                    Category = table.Column<string>(type: "longtext", nullable: false),
                    MainImageUrl = table.Column<string>(type: "longtext", nullable: true),
                    AdditionalImages = table.Column<string>(type: "longtext", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StockQuantity = table.Column<int>(type: "int", nullable: false),
                    Unit = table.Column<string>(type: "longtext", nullable: false),
                    Status = table.Column<string>(type: "longtext", nullable: false),
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
                    table.PrimaryKey("PK_Products", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Name = table.Column<string>(type: "longtext", nullable: false),
                    Description = table.Column<string>(type: "longtext", nullable: false),
                    Permissions = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Username = table.Column<string>(type: "longtext", nullable: false),
                    PasswordHash = table.Column<string>(type: "longtext", nullable: false),
                    FullName = table.Column<string>(type: "longtext", nullable: false),
                    Email = table.Column<string>(type: "longtext", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CompanyId = table.Column<Guid>(type: "char(36)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "longtext", nullable: true),
                    CitizenId = table.Column<string>(type: "longtext", nullable: true),
                    Address = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "WarehouseLocations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Zone = table.Column<string>(type: "longtext", nullable: false),
                    Aisle = table.Column<string>(type: "longtext", nullable: false),
                    Rack = table.Column<string>(type: "longtext", nullable: false),
                    Bin = table.Column<string>(type: "longtext", nullable: false),
                    Barcode = table.Column<string>(type: "longtext", nullable: false),
                    Description = table.Column<string>(type: "longtext", nullable: false),
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
                    table.PrimaryKey("PK_WarehouseLocations", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "InventoryTransactionLines",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    TransactionId = table.Column<Guid>(type: "char(36)", nullable: false),
                    ProductId = table.Column<Guid>(type: "char(36)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryTransactionLines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InventoryTransactionLines_InventoryTransactions_TransactionId",
                        column: x => x.TransactionId,
                        principalTable: "InventoryTransactions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InventoryTransactionLines_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProductBatches",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    ProductId = table.Column<Guid>(type: "char(36)", nullable: false),
                    BatchNumber = table.Column<string>(type: "longtext", nullable: false),
                    MfgDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
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
                    table.PrimaryKey("PK_ProductBatches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductBatches_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    RolesId = table.Column<Guid>(type: "char(36)", nullable: false),
                    UsersId = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.RolesId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RolesId",
                        column: x => x.RolesId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UsersId",
                        column: x => x.UsersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "StockLevels",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    ProductId = table.Column<Guid>(type: "char(36)", nullable: false),
                    LocationId = table.Column<Guid>(type: "char(36)", nullable: true),
                    BatchId = table.Column<Guid>(type: "char(36)", nullable: true),
                    StoreId = table.Column<Guid>(type: "char(36)", nullable: false),
                    QuantityOnHand = table.Column<int>(type: "int", nullable: false),
                    AvailableQuantity = table.Column<int>(type: "int", nullable: false),
                    ReservedQuantity = table.Column<int>(type: "int", nullable: false),
                    ReorderPoint = table.Column<int>(type: "int", nullable: false),
                    MovingAverageCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LastRestockedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "longblob", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockLevels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockLevels_ProductBatches_BatchId",
                        column: x => x.BatchId,
                        principalTable: "ProductBatches",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StockLevels_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StockLevels_WarehouseLocations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "WarehouseLocations",
                        principalColumn: "Id");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "CompanyId", "CreatedBy", "CreatedDate", "DeletedBy", "DeletedDate", "Description", "Icon", "IsDeleted", "ModifiedBy", "ModifiedDate", "Name", "ParentCategoryId", "ParentId" },
                values: new object[,]
                {
                    { new Guid("01950000-0000-7000-8000-000000001001"), new Guid("01950000-0000-7000-8000-000000000000"), null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Hoa quả tươi các loại", "🍎", false, null, null, "Trái cây", null, null },
                    { new Guid("01950000-0000-7000-8000-000000001002"), new Guid("01950000-0000-7000-8000-000000000000"), null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Rau củ sạch nông trại", "🥬", false, null, null, "Rau củ", null, null },
                    { new Guid("01950000-0000-7000-8000-000000001003"), new Guid("01950000-0000-7000-8000-000000000000"), null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Thịt tươi sống và hải sản", "🥩", false, null, null, "Thịt cá", null, null }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "AdditionalImages", "Category", "CompanyId", "CreatedBy", "CreatedDate", "DeletedBy", "DeletedDate", "IsDeleted", "MainImageUrl", "ModifiedBy", "ModifiedDate", "Name", "Price", "Status", "StockQuantity", "Unit" },
                values: new object[,]
                {
                    { new Guid("01950000-0000-7000-8000-000000002001"), "[]", "Trái cây", new Guid("01950000-0000-7000-8000-000000000000"), null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, false, null, null, null, "Táo New Zealand size to", 75000m, "Đang bán", 150, "kg" },
                    { new Guid("01950000-0000-7000-8000-000000002002"), "[]", "Rau củ", new Guid("01950000-0000-7000-8000-000000000000"), null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, false, null, null, null, "Rau cải thìa hữu cơ", 15000m, "Đang bán", 30, "bó" },
                    { new Guid("01950000-0000-7000-8000-000000002003"), "[]", "Thịt cá", new Guid("01950000-0000-7000-8000-000000000000"), null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, false, null, null, null, "Thịt bò thăn Úc tươi sạch", 350000m, "Sắp hết", 5, "kg" }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Description", "Name", "Permissions" },
                values: new object[,]
                {
                    { new Guid("01950000-0000-7000-8000-000000000001"), "System Administrator", "Admin", -1L },
                    { new Guid("01950000-0000-7000-8000-000000000002"), "Store Manager", "Manager", 24117249L },
                    { new Guid("01950000-0000-7000-8000-000000000003"), "Store Cashier", "Cashier", 17825792L }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "CitizenId", "CompanyId", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "PhoneNumber", "Username" },
                values: new object[] { new Guid("01950000-0000-7000-8000-000000000004"), null, null, new Guid("01950000-0000-7000-8000-000000000000"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@taphoa.com", "System Admin", true, "$2a$11$8rpnI.9n7caa2N3lLrkVeOyfSDUH1LlRGHt4.64Z6c0uGaFs8q0xy", null, "admin" });

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "RolesId", "UsersId" },
                values: new object[] { new Guid("01950000-0000-7000-8000-000000000001"), new Guid("01950000-0000-7000-8000-000000000004") });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_ParentCategoryId",
                table: "Categories",
                column: "ParentCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryTransactionLines_ProductId",
                table: "InventoryTransactionLines",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryTransactionLines_TransactionId",
                table: "InventoryTransactionLines",
                column: "TransactionId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductBatches_ProductId",
                table: "ProductBatches",
                column: "ProductId");

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
                name: "IX_UserRoles_UsersId",
                table: "UserRoles",
                column: "UsersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "InventoryTransactionLines");

            migrationBuilder.DropTable(
                name: "StockLevels");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "InventoryTransactions");

            migrationBuilder.DropTable(
                name: "ProductBatches");

            migrationBuilder.DropTable(
                name: "WarehouseLocations");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
