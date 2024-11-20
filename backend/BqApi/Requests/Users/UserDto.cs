using BeautyQueenApi.Requests.Appointments;
using BeautyQueenApi.Requests.Promos;
using BeautyQueenApi.Requests.PunchMaps;

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

        public EmployeeDto? Employee { get; set; }
        public PunchMapDto? PunchMap { get; set; }
        public List<AppointmentDto>? Appointments { get; set; }
        public List<PromoDto>? Promos { get; set; }
    }
}
