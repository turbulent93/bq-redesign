using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BqApi.Migrations
{
    /// <inheritdoc />
    public partial class UniteEmployeeAndUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_Employee_EmployeeId",
                table: "Appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_User_UserId",
                table: "Appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_PunchMap_Employee_EmployeeId",
                table: "PunchMap");

            migrationBuilder.DropForeignKey(
                name: "FK_Schedule_Employee_EmployeeId",
                table: "Schedule");

            migrationBuilder.DropTable(
                name: "EmployeeSpecialization");

            migrationBuilder.DropTable(
                name: "Employee");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Appointment",
                newName: "ClientId");

            migrationBuilder.RenameIndex(
                name: "IX_Appointment_UserId",
                table: "Appointment",
                newName: "IX_Appointment_ClientId");

            migrationBuilder.AddColumn<string>(
                name: "AuthTgCode",
                table: "User",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "AvatarId",
                table: "User",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "User",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NotificationsEnabled",
                table: "User",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "TgChatId",
                table: "User",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SpecializationUser",
                columns: table => new
                {
                    EmployeesId = table.Column<int>(type: "integer", nullable: false),
                    SpecializationsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecializationUser", x => new { x.EmployeesId, x.SpecializationsId });
                    table.ForeignKey(
                        name: "FK_SpecializationUser_Specialization_SpecializationsId",
                        column: x => x.SpecializationsId,
                        principalTable: "Specialization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SpecializationUser_User_EmployeesId",
                        column: x => x.EmployeesId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_User_AvatarId",
                table: "User",
                column: "AvatarId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SpecializationUser_SpecializationsId",
                table: "SpecializationUser",
                column: "SpecializationsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_User_ClientId",
                table: "Appointment",
                column: "ClientId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_User_EmployeeId",
                table: "Appointment",
                column: "EmployeeId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PunchMap_User_EmployeeId",
                table: "PunchMap",
                column: "EmployeeId",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Schedule_User_EmployeeId",
                table: "Schedule",
                column: "EmployeeId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_User_File_AvatarId",
                table: "User",
                column: "AvatarId",
                principalTable: "File",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_User_ClientId",
                table: "Appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_User_EmployeeId",
                table: "Appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_PunchMap_User_EmployeeId",
                table: "PunchMap");

            migrationBuilder.DropForeignKey(
                name: "FK_Schedule_User_EmployeeId",
                table: "Schedule");

            migrationBuilder.DropForeignKey(
                name: "FK_User_File_AvatarId",
                table: "User");

            migrationBuilder.DropTable(
                name: "SpecializationUser");

            migrationBuilder.DropIndex(
                name: "IX_User_AvatarId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "AuthTgCode",
                table: "User");

            migrationBuilder.DropColumn(
                name: "AvatarId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "User");

            migrationBuilder.DropColumn(
                name: "NotificationsEnabled",
                table: "User");

            migrationBuilder.DropColumn(
                name: "TgChatId",
                table: "User");

            migrationBuilder.RenameColumn(
                name: "ClientId",
                table: "Appointment",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Appointment_ClientId",
                table: "Appointment",
                newName: "IX_Appointment_UserId");

            migrationBuilder.CreateTable(
                name: "Employee",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FileId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    AuthTgCode = table.Column<string>(type: "text", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    NotificationsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    TgChatId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employee", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Employee_File_FileId",
                        column: x => x.FileId,
                        principalTable: "File",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Employee_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmployeeSpecialization",
                columns: table => new
                {
                    EmployeesId = table.Column<int>(type: "integer", nullable: false),
                    SpecializationsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeSpecialization", x => new { x.EmployeesId, x.SpecializationsId });
                    table.ForeignKey(
                        name: "FK_EmployeeSpecialization_Employee_EmployeesId",
                        column: x => x.EmployeesId,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmployeeSpecialization_Specialization_SpecializationsId",
                        column: x => x.SpecializationsId,
                        principalTable: "Specialization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Employee_FileId",
                table: "Employee",
                column: "FileId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employee_UserId",
                table: "Employee",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeSpecialization_SpecializationsId",
                table: "EmployeeSpecialization",
                column: "SpecializationsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_Employee_EmployeeId",
                table: "Appointment",
                column: "EmployeeId",
                principalTable: "Employee",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_User_UserId",
                table: "Appointment",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PunchMap_Employee_EmployeeId",
                table: "PunchMap",
                column: "EmployeeId",
                principalTable: "Employee",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Schedule_Employee_EmployeeId",
                table: "Schedule",
                column: "EmployeeId",
                principalTable: "Employee",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
