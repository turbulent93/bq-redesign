using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BqApi.Migrations
{
    /// <inheritdoc />
    public partial class AddInvitedUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InvitePromoId",
                table: "User",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InviterId",
                table: "User",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_InvitePromoId",
                table: "User",
                column: "InvitePromoId");

            migrationBuilder.CreateIndex(
                name: "IX_User_InviterId",
                table: "User",
                column: "InviterId");

            migrationBuilder.AddForeignKey(
                name: "FK_User_Promo_InvitePromoId",
                table: "User",
                column: "InvitePromoId",
                principalTable: "Promo",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_User_User_InviterId",
                table: "User",
                column: "InviterId",
                principalTable: "User",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Promo_InvitePromoId",
                table: "User");

            migrationBuilder.DropForeignKey(
                name: "FK_User_User_InviterId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_InvitePromoId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_InviterId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "InvitePromoId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "InviterId",
                table: "User");
        }
    }
}
