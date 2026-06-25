using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TapHoa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixedSeeds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000000004"),
                column: "PasswordHash",
                value: "$2a$11$90Xb.I39c65h/T9qWn.2IuTksr6Kx7Oa6Jt4i57l.P6z0uLWe21M6");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("01950000-0000-7000-8000-000000000004"),
                column: "PasswordHash",
                value: "$2a$11$bRAdsLz9ibR4qlZn7yGaoO8HD.HnlhlS0dTf2Ah4rgydYC8HAIT2C");
        }
    }
}
