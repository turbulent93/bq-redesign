using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BqApi.Migrations
{
    /// <inheritdoc />
    public partial class AdddPromosToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PromoId",
                table: "Appointment",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PromoUser",
                columns: table => new
                {
                    PromosId = table.Column<int>(type: "integer", nullable: false),
                    UsersId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromoUser", x => new { x.PromosId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_PromoUser_Promo_PromosId",
                        column: x => x.PromosId,
                        principalTable: "Promo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PromoUser_User_UsersId",
                        column: x => x.UsersId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_PromoId",
                table: "Appointment",
                column: "PromoId");

            migrationBuilder.CreateIndex(
                name: "IX_PromoUser_UsersId",
                table: "PromoUser",
                column: "UsersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_Promo_PromoId",
                table: "Appointment",
                column: "PromoId",
                principalTable: "Promo",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_Promo_PromoId",
                table: "Appointment");

            migrationBuilder.DropTable(
                name: "PromoUser");

            migrationBuilder.DropIndex(
                name: "IX_Appointment_PromoId",
                table: "Appointment");

            migrationBuilder.DropColumn(
                name: "PromoId",
                table: "Appointment");
        }
    }
}
