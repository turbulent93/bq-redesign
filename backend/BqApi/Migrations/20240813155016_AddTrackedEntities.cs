using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BqApi.Migrations
{
    /// <inheritdoc />
    public partial class AddTrackedEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Specialization",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Service",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "File",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Appointment",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Specialization");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Service");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "File");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Appointment");
        }
    }
}
