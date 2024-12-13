using BeautyQueenApi.Requests.Specializations;
using BeautyQueenApi.Requests.Users;
using BqApi.Models;
using BqApi.Requests.Users;
using BqApi.Services.UploadService;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace BeautyQueenApi.Models
{
    [Index(nameof(Login), IsUnique = true)]
    public class User(string login, string? password, string role, int? punchMapId, int? stepsCount, string? fullName, int? avatarId)
    {
        [Key]
        public int Id { get; set; }
        public string Login { get; set; } = login;
        public string? Password { get; set; } = password;
        public string? RefreshToken { get; set; }
        public DateTime? ExpiresIn { get; set; }
        public string Role { get; set; } = role;
        public int? PunchMapId { get; set; } = punchMapId;
        public int? StepsCount { get; set; } = stepsCount;
        public string? FullName { get; set; } = fullName;
        public int? AvatarId { get; set; } = avatarId;
        public bool NotificationsEnabled { get; set; } = false;
        public string AuthTgCode { get; set; } = Guid.NewGuid().ToString();
        public string? TgChatId { get; set; }

        public List<Specialization> Specializations { get; set; } = null!;
        public UploadedFile? Avatar { get; set; }
        public PunchMap? PunchMap { get; set; } = null!;
        public List<Appointment> EmployeeAppointments { get; set; } = null!;
        public List<Appointment> ClientAppointments { get; set; } = null!;
        public List<Promo> Promos { get; set; } = null!;
        public List<PunchMap>? PunchMaps { get; set; } = null!;

        public void Update(string login, string? password, string role, int? punchMapId, int? stepsCount, string? fullName, int? avatarId) {
            Login = login;
            if(password != null)
                Password = password;
            Role = role;
            PunchMapId = punchMapId;
            StepsCount = stepsCount;
            FullName = fullName;
            AvatarId = avatarId;
        }

        public void AddStep()
        {
            StepsCount = StepsCount != null ? StepsCount + 1 : 1;
        }

        public void PartialUpdate(string? phone, int? punchMapId)
        {
            if(phone != null)
                Login = phone;
            if(punchMapId != null)
                PunchMapId = punchMapId;
        }

        public void UpdateChatId(string chatId)
        {
            TgChatId = chatId;
        }
    }
}
