using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BqApi.Migrations
{
    /// <inheritdoc />
    public partial class AddBonusesToService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BonusCount",
                table: "Service",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PaidAmountWithBonuses",
                table: "Service",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BonusCount",
                table: "Service");

            migrationBuilder.DropColumn(
                name: "PaidAmountWithBonuses",
                table: "Service");
        }
    }
}
