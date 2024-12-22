using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Appointments;
using BeautyQueenApi.Requests.Promos;
using BeautyQueenApi.Requests.PunchMaps;
using BeautyQueenApi.Requests.Specializations;
using BqApi.Models;
using BqApi.Services.UploadService;

namespace BqApi.Requests.Users
{
    public class UserDto
    {
        public int? Id { get; set; }
        public string Login { get; set; } = null!;
        public string? Password { get; set; } = null!;
        public string? NewPassword { get; set; } = null!;
        public string Role { get; set; } = null!;
        public int? PunchMapId { get; set; }
        public int? StepsCount { get; set; }
        public string? FullName { get; set; } = null!;
        public int? AvatarId { get; set; }
        public bool? NotificationsEnabled { get; set; }
        public string? AuthTgCode { get; set; }
        public string? TgChatId { get; set; }
        public int? InviterId { get; set; }
        public int? InvitePromoId { get; set; }
        public string? StartWorkTime { get; set; }
        public string? EndWorkTime { get; set; }
        public DateTime? CreatedAt { get; set; }

        public PromoDto? InvitePromo { get; set; } = null!;
        public List<UserDto>? InvitedUsers { get; set; } = null!;
        public List<int> SpecializationIds { get; set; } = [];
        public List<SpecializationDto>? Specializations { get; set; } = null!;
        public FileDto? Avatar { get; set; } = null!;
        public PunchMapDto? PunchMap { get; set; }
        //public List<AppointmentDto>? EmployeeAppointments { get; set; } = null!;
        public List<AppointmentDto>? ClientAppointments { get; set; } = null!;
        public List<PromoDto>? Promos { get; set; }
        public List<UpcomigAppointment> UpcomingAppointments { get; set; } = [];
    }
}
