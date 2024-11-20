using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BqApi.Migrations
{
    /// <inheritdoc />
    public partial class AddStepsCountToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StepsCount",
                table: "User",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StepsCount",
                table: "User");
        }
    }
}
