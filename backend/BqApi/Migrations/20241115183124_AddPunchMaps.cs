using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BqApi.Migrations
{
    /// <inheritdoc />
    public partial class AddPunchMaps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AppointmentId",
                table: "User",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PunchMapId",
                table: "User",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PunchMap",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EmployeeId = table.Column<int>(type: "integer", nullable: true),
                    StepsCount = table.Column<int>(type: "integer", nullable: false),
                    ColumnsCount = table.Column<int>(type: "integer", nullable: false),
                    CreatedBy = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PunchMap", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PunchMap_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PunchMapPromo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PunchMapId = table.Column<int>(type: "integer", nullable: false),
                    PromoId = table.Column<int>(type: "integer", nullable: false),
                    Step = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PunchMapPromo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PunchMapPromo_Promo_PromoId",
                        column: x => x.PromoId,
                        principalTable: "Promo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PunchMapPromo_PunchMap_PunchMapId",
                        column: x => x.PunchMapId,
                        principalTable: "PunchMap",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_User_AppointmentId",
                table: "User",
                column: "AppointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_User_PunchMapId",
                table: "User",
                column: "PunchMapId");

            migrationBuilder.CreateIndex(
                name: "IX_PunchMap_EmployeeId",
                table: "PunchMap",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_PunchMapPromo_PromoId",
                table: "PunchMapPromo",
                column: "PromoId");

            migrationBuilder.CreateIndex(
                name: "IX_PunchMapPromo_PunchMapId",
                table: "PunchMapPromo",
                column: "PunchMapId");

            migrationBuilder.AddForeignKey(
                name: "FK_User_Appointment_AppointmentId",
                table: "User",
                column: "AppointmentId",
                principalTable: "Appointment",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_User_PunchMap_PunchMapId",
                table: "User",
                column: "PunchMapId",
                principalTable: "PunchMap",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Appointment_AppointmentId",
                table: "User");

            migrationBuilder.DropForeignKey(
                name: "FK_User_PunchMap_PunchMapId",
                table: "User");

            migrationBuilder.DropTable(
                name: "PunchMapPromo");

            migrationBuilder.DropTable(
                name: "PunchMap");

            migrationBuilder.DropIndex(
                name: "IX_User_AppointmentId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_PunchMapId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "AppointmentId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "PunchMapId",
                table: "User");
        }
    }
}
