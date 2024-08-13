using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BqApi.Migrations
{
    /// <inheritdoc />
    public partial class AddTgNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AuthTgCode",
                table: "Employee",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "NotificationsEnabled",
                table: "Employee",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "TgChatId",
                table: "Employee",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AuthTgCode",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "NotificationsEnabled",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "TgChatId",
                table: "Employee");
        }
    }
}
