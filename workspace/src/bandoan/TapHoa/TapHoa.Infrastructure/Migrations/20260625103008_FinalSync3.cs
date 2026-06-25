using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TapHoa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FinalSync3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("019efe53-5f2b-756f-8ddc-1711ad07eca0"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("019efe53-5f2b-7704-ba83-b5f736da0193"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("019efe53-5f2b-7a6b-a662-b2eba5ff371b"));

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("019efe53-5f2b-7126-a90e-fcd48205a9fd"));

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("019efe53-5f2b-7895-a0de-1e9c3a2ebfab"));

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("019efe53-5f2b-7c9e-89bb-2937d61034b3"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("019efe53-5dca-766f-ac37-ec499c709259"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("019efe53-5dca-7ce5-8e4e-41329cc2d729"));

            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumns: new[] { "RolesId", "UsersId" },
                keyValues: new object[] { new Guid("019efe53-5dca-75c7-865c-5f89f67066e5"), new Guid("019efe53-5dca-7456-b106-fbd025a036ea") });

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("019efe53-5dca-75c7-865c-5f89f67066e5"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("019efe53-5dca-7456-b106-fbd025a036ea"));

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
                values: new object[] { new Guid("01950000-0000-7000-8000-000000000004"), null, null, new Guid("01950000-0000-7000-8000-000000000000"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@taphoa.com", "System Admin", true, "$2a$11$bRAdsLz9ibR4qlZn7yGaoO8HD.HnlhlS0dTf2Ah4rgydYC8HAIT2C", null, "admin" });

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "RolesId", "UsersId" },
                values: new object[] { new Guid("01950000-0000-7000-8000-000000000001"), new Guid("01950000-0000-7000-8000-000000000004") });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000001001"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000001002"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000001003"));

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000002001"));

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000002002"));

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000002003"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000000003"));

            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumns: new[] { "RolesId", "UsersId" },
                keyValues: new object[] { new Guid("01950000-0000-7000-8000-000000000001"), new Guid("01950000-0000-7000-8000-000000000004") });

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000000004"));

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "CompanyId", "CreatedBy", "CreatedDate", "DeletedBy", "DeletedDate", "Description", "Icon", "IsDeleted", "ModifiedBy", "ModifiedDate", "Name", "ParentCategoryId", "ParentId" },
                values: new object[,]
                {
                    { new Guid("019efe53-5f2b-756f-8ddc-1711ad07eca0"), new Guid("019efe53-5dca-72d8-b3d0-0891284f5fbf"), null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Thịt tươi sống và hải sản", "🥩", false, null, null, "Thịt cá", null, null },
                    { new Guid("019efe53-5f2b-7704-ba83-b5f736da0193"), new Guid("019efe53-5dca-72d8-b3d0-0891284f5fbf"), null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Rau củ sạch nông trại", "🥬", false, null, null, "Rau củ", null, null },
                    { new Guid("019efe53-5f2b-7a6b-a662-b2eba5ff371b"), new Guid("019efe53-5dca-72d8-b3d0-0891284f5fbf"), null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Hoa quả tươi các loại", "🍎", false, null, null, "Trái cây", null, null }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "AdditionalImages", "Category", "CompanyId", "CreatedBy", "CreatedDate", "DeletedBy", "DeletedDate", "IsDeleted", "MainImageUrl", "ModifiedBy", "ModifiedDate", "Name", "Price", "Status", "StockQuantity", "Unit" },
                values: new object[,]
                {
                    { new Guid("019efe53-5f2b-7126-a90e-fcd48205a9fd"), "[]", "Thịt cá", new Guid("019efe53-5dca-72d8-b3d0-0891284f5fbf"), null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, false, null, null, null, "Thịt bò thăn Úc tươi sạch", 350000m, "Sắp hết", 5, "kg" },
                    { new Guid("019efe53-5f2b-7895-a0de-1e9c3a2ebfab"), "[]", "Rau củ", new Guid("019efe53-5dca-72d8-b3d0-0891284f5fbf"), null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, false, null, null, null, "Rau cải thìa hữu cơ", 15000m, "Đang bán", 30, "bó" },
                    { new Guid("019efe53-5f2b-7c9e-89bb-2937d61034b3"), "[]", "Trái cây", new Guid("019efe53-5dca-72d8-b3d0-0891284f5fbf"), null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, false, null, null, null, "Táo New Zealand size to", 75000m, "Đang bán", 150, "kg" }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Description", "Name", "Permissions" },
                values: new object[,]
                {
                    { new Guid("019efe53-5dca-75c7-865c-5f89f67066e5"), "System Administrator", "Admin", -1L },
                    { new Guid("019efe53-5dca-766f-ac37-ec499c709259"), "Store Cashier", "Cashier", 17825792L },
                    { new Guid("019efe53-5dca-7ce5-8e4e-41329cc2d729"), "Store Manager", "Manager", 24117249L }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "CitizenId", "CompanyId", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "PhoneNumber", "Username" },
                values: new object[] { new Guid("019efe53-5dca-7456-b106-fbd025a036ea"), null, null, new Guid("019efe53-5dca-72d8-b3d0-0891284f5fbf"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@taphoa.com", "System Admin", true, "$2a$11$rRmpF39d9FlLVGQyFIn/mutCHhGs9uW/nTWiN9ZyYPh2OJ7/3Pz5.", null, "admin" });

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "RolesId", "UsersId" },
                values: new object[] { new Guid("019efe53-5dca-75c7-865c-5f89f67066e5"), new Guid("019efe53-5dca-7456-b106-fbd025a036ea") });
        }
    }
}
