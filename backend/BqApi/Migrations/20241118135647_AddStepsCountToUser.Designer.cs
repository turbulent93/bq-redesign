﻿// <auto-generated />
using System;
using BeautyQueenApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BqApi.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241118135647_AddStepsCountToUser")]
    partial class AddStepsCountToUser
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("BeautyQueenApi.Models.Appointment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("CreatedBy")
                        .HasColumnType("integer");

                    b.Property<int>("EmployeeId")
                        .HasColumnType("integer");

                    b.Property<TimeOnly>("EndAt")
                        .HasColumnType("time without time zone");

                    b.Property<int>("PaidWithBonuses")
                        .HasColumnType("integer");

                    b.Property<int>("ScheduleId")
                        .HasColumnType("integer");

                    b.Property<int>("ServiceId")
                        .HasColumnType("integer");

                    b.Property<TimeOnly>("StartAt")
                        .HasColumnType("time without time zone");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("EmployeeId");

                    b.HasIndex("ScheduleId");

                    b.HasIndex("ServiceId");

                    b.HasIndex("UserId");

                    b.ToTable("Appointment");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.Employee", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("AuthTgCode")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("FileId")
                        .HasColumnType("integer");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("NotificationsEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("TgChatId")
                        .HasColumnType("text");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("FileId")
                        .IsUnique();

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("Employee");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.Promo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("BonusCount")
                        .HasColumnType("integer");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateOnly>("EndDate")
                        .HasColumnType("date");

                    b.Property<int>("ImageId")
                        .HasColumnType("integer");

                    b.Property<DateOnly>("StartDate")
                        .HasColumnType("date");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Type")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("ImageId")
                        .IsUnique();

                    b.ToTable("Promo");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.PromoService", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("Discount")
                        .HasColumnType("integer");

                    b.Property<int>("PromoId")
                        .HasColumnType("integer");

                    b.Property<int>("ServiceId")
                        .HasColumnType("integer");

                    b.Property<string>("Unit")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("PromoId");

                    b.HasIndex("ServiceId");

                    b.ToTable("PromoService");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.PunchMapPromo", b =>
                {
                    b.Property<int?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int?>("Id"));

                    b.Property<int>("PromoId")
                        .HasColumnType("integer");

                    b.Property<int>("PunchMapId")
                        .HasColumnType("integer");

                    b.Property<int>("Step")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("PromoId");

                    b.HasIndex("PunchMapId");

                    b.ToTable("PunchMapPromo");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.Schedule", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateOnly>("Date")
                        .HasColumnType("date");

                    b.Property<int>("EmployeeId")
                        .HasColumnType("integer");

                    b.Property<TimeOnly>("EndAt")
                        .HasColumnType("time without time zone");

                    b.Property<TimeOnly>("StartAt")
                        .HasColumnType("time without time zone");

                    b.HasKey("Id");

                    b.HasIndex("EmployeeId");

                    b.ToTable("Schedule");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.Service", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("BonusCount")
                        .HasColumnType("integer");

                    b.Property<int>("CreatedBy")
                        .HasColumnType("integer");

                    b.Property<int>("Duration")
                        .HasColumnType("integer");

                    b.Property<int>("GroupId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("PaidAmountWithBonuses")
                        .HasColumnType("integer");

                    b.Property<int>("Price")
                        .HasColumnType("integer");

                    b.Property<int>("SpecializationId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("GroupId");

                    b.HasIndex("SpecializationId");

                    b.ToTable("Service");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.ServiceGroup", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("CreatedBy")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("ServiceGroup");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.Specialization", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("CreatedBy")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Specialization");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime?>("ExpiresIn")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Login")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .HasColumnType("text");

                    b.Property<int?>("PunchMapId")
                        .HasColumnType("integer");

                    b.Property<string>("RefreshToken")
                        .HasColumnType("text");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int?>("StepsCount")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("Login")
                        .IsUnique();

                    b.HasIndex("PunchMapId");

                    b.ToTable("User");
                });

            modelBuilder.Entity("BqApi.Models.Gallery", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("CreatedBy")
                        .HasColumnType("integer");

                    b.Property<int>("ImageId")
                        .HasColumnType("integer");

                    b.Property<int>("ServiceId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("ImageId")
                        .IsUnique();

                    b.HasIndex("ServiceId");

                    b.ToTable("Gallery");
                });

            modelBuilder.Entity("BqApi.Models.PunchMap", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("ColumnsCount")
                        .HasColumnType("integer");

                    b.Property<int>("CreatedBy")
                        .HasColumnType("integer");

                    b.Property<int?>("EmployeeId")
                        .HasColumnType("integer");

                    b.Property<int>("StepsCount")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("EmployeeId");

                    b.ToTable("PunchMap");
                });

            modelBuilder.Entity("BqApi.Models.UploadedFile", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("CreatedBy")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Path")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("File");
                });

            modelBuilder.Entity("EmployeeSpecialization", b =>
                {
                    b.Property<int>("EmployeesId")
                        .HasColumnType("integer");

                    b.Property<int>("SpecializationsId")
                        .HasColumnType("integer");

                    b.HasKey("EmployeesId", "SpecializationsId");

                    b.HasIndex("SpecializationsId");

                    b.ToTable("EmployeeSpecialization");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.Appointment", b =>
                {
                    b.HasOne("BeautyQueenApi.Models.Employee", "Employee")
                        .WithMany()
                        .HasForeignKey("EmployeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BeautyQueenApi.Models.Schedule", "Schedule")
                        .WithMany("Appointments")
                        .HasForeignKey("ScheduleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BeautyQueenApi.Models.Service", "Service")
                        .WithMany()
                        .HasForeignKey("ServiceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BeautyQueenApi.Models.User", "User")
                        .WithMany("Appointments")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Employee");

                    b.Navigation("Schedule");

                    b.Navigation("Service");

                    b.Navigation("User");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.Employee", b =>
                {
                    b.HasOne("BqApi.Models.UploadedFile", "File")
                        .WithOne("Employee")
                        .HasForeignKey("BeautyQueenApi.Models.Employee", "FileId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BeautyQueenApi.Models.User", "User")
                        .WithOne("Employee")
                        .HasForeignKey("BeautyQueenApi.Models.Employee", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("File");

                    b.Navigation("User");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.Promo", b =>
                {
                    b.HasOne("BqApi.Models.UploadedFile", "Image")
                        .WithOne("Promo")
                        .HasForeignKey("BeautyQueenApi.Models.Promo", "ImageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Image");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.PromoService", b =>
                {
                    b.HasOne("BeautyQueenApi.Models.Promo", "Promo")
                        .WithMany("PromoServices")
                        .HasForeignKey("PromoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BeautyQueenApi.Models.Service", "Service")
                        .WithMany("PromoServices")
                        .HasForeignKey("ServiceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Promo");

                    b.Navigation("Service");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.PunchMapPromo", b =>
                {
                    b.HasOne("BeautyQueenApi.Models.Promo", "Promo")
                        .WithMany()
                        .HasForeignKey("PromoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BqApi.Models.PunchMap", "PunchMap")
                        .WithMany("PunchMapPromos")
                        .HasForeignKey("PunchMapId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Promo");

                    b.Navigation("PunchMap");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.Schedule", b =>
                {
                    b.HasOne("BeautyQueenApi.Models.Employee", "Employee")
                        .WithMany()
                        .HasForeignKey("EmployeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Employee");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.Service", b =>
                {
                    b.HasOne("BeautyQueenApi.Models.ServiceGroup", "Group")
                        .WithMany("Services")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BeautyQueenApi.Models.Specialization", "Specialization")
                        .WithMany("Services")
                        .HasForeignKey("SpecializationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Group");

                    b.Navigation("Specialization");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.User", b =>
                {
                    b.HasOne("BqApi.Models.PunchMap", "PunchMap")
                        .WithMany()
                        .HasForeignKey("PunchMapId");

                    b.Navigation("PunchMap");
                });

            modelBuilder.Entity("BqApi.Models.Gallery", b =>
                {
                    b.HasOne("BqApi.Models.UploadedFile", "Image")
                        .WithOne("Gallery")
                        .HasForeignKey("BqApi.Models.Gallery", "ImageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BeautyQueenApi.Models.Service", "Service")
                        .WithMany()
                        .HasForeignKey("ServiceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Image");

                    b.Navigation("Service");
                });

            modelBuilder.Entity("BqApi.Models.PunchMap", b =>
                {
                    b.HasOne("BeautyQueenApi.Models.Employee", "Employee")
                        .WithMany()
                        .HasForeignKey("EmployeeId");

                    b.Navigation("Employee");
                });

            modelBuilder.Entity("EmployeeSpecialization", b =>
                {
                    b.HasOne("BeautyQueenApi.Models.Employee", null)
                        .WithMany()
                        .HasForeignKey("EmployeesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BeautyQueenApi.Models.Specialization", null)
                        .WithMany()
                        .HasForeignKey("SpecializationsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("BeautyQueenApi.Models.Promo", b =>
                {
                    b.Navigation("PromoServices");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.Schedule", b =>
                {
                    b.Navigation("Appointments");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.Service", b =>
                {
                    b.Navigation("PromoServices");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.ServiceGroup", b =>
                {
                    b.Navigation("Services");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.Specialization", b =>
                {
                    b.Navigation("Services");
                });

            modelBuilder.Entity("BeautyQueenApi.Models.User", b =>
                {
                    b.Navigation("Appointments");

                    b.Navigation("Employee");
                });

            modelBuilder.Entity("BqApi.Models.PunchMap", b =>
                {
                    b.Navigation("PunchMapPromos");
                });

            modelBuilder.Entity("BqApi.Models.UploadedFile", b =>
                {
                    b.Navigation("Employee");

                    b.Navigation("Gallery");

                    b.Navigation("Promo");
                });
#pragma warning restore 612, 618
        }
    }
}
