using BeautyQueenApi.Requests.Appointments;

namespace BqApi.Requests.Schedules
{
    public class SchedulePeriodDto
    {
        public string? StartAt { get; set; }
        public string? EndAt { get; set; }
        public AppointmentDto? Appointment { get; set; }
    }
}
