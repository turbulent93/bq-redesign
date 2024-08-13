using BeautyQueenApi.Requests.Schedules;
using BeautyQueenApi.Requests.Services;
using BqApi.Requests.Users;

namespace BeautyQueenApi.Requests.Appointments
{
    public class AppointmentDto
    {
        public int? Id { get; set; }
        public int EmployeeId { get; set; }
        public int ScheduleId { get; set; }
        public int ServiceId { get; set; }
        public string StartAt { get; set; } = null!;
        public string EndAt { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public int CreatedBy { get; set; }

        public EmployeeDto? Employee { get; set; }
        public ScheduleDto? Schedule { get; set; }
        public ServiceDto? Service { get; set; }
    }
}
