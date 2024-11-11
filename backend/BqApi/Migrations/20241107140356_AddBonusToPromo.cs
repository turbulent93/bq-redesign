using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BqApi.Migrations
{
    /// <inheritdoc />
    public partial class AddBonusToPromo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Promo");

            migrationBuilder.AddColumn<int>(
                name: "BonusCount",
                table: "Promo",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Promo",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BonusCount",
                table: "Promo");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Promo");

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Promo",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
