﻿using BeautyQueenApi.Requests.Users;
using BqApi.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace BeautyQueenApi.Models
{
    [Index(nameof(Login), IsUnique = true)]
    public class User(string login, string password, string role, int? punchMapId)
    {
        [Key]
        public int Id { get; set; }
        public string Login { get; set; } = login;
        public string Password { get; set; } = password;
        public string? RefreshToken { get; set; }
        public DateTime? ExpiresIn { get; set; }
        public string Role { get; set; } = role;
        public int? PunchMapId { get; set; } = punchMapId;

        public Employee? Employee { get; set; } = null!;
        public PunchMap? PunchMap { get; set; } = null!;
        //public List<Appointment> Appointments { get; set; } = null!;

        public void Update(string login, string? password, string role) {
            Login = login;
            if(password != null)
                Password = password;
            Role = role;
        }
    }
}
