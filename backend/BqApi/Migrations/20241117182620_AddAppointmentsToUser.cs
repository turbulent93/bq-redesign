using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BqApi.Migrations
{
    /// <inheritdoc />
    public partial class AddAppointmentsToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Appointment_AppointmentId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_AppointmentId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "AppointmentId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Appointment");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Appointment",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_UserId",
                table: "Appointment",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_User_UserId",
                table: "Appointment",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_User_UserId",
                table: "Appointment");

            migrationBuilder.DropIndex(
                name: "IX_Appointment_UserId",
                table: "Appointment");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Appointment");

            migrationBuilder.AddColumn<int>(
                name: "AppointmentId",
                table: "User",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Appointment",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_User_AppointmentId",
                table: "User",
                column: "AppointmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_User_Appointment_AppointmentId",
                table: "User",
                column: "AppointmentId",
                principalTable: "Appointment",
                principalColumn: "Id");
        }
    }
}
