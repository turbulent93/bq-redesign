using BeautyQueenApi.Requests.Schedules;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BeautyQueenApi.Models
{
    public class Schedule
    {
        [Key]
        public int Id { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly StartAt { get; set; }
        public TimeOnly EndAt { get; set; }
        public int EmployeeId { get; set; }

        public Employee Employee { get; set; } = null!;

        public List<Appointment>? Appointments { get; set; }

        public void Update(CreateOrUpdateScheduleRequest request)
        {
            Date = DateOnly.Parse(request.Date);
            StartAt = TimeOnly.Parse(request.StartAt);
            EndAt = TimeOnly.Parse(request.EndAt);
            EmployeeId = request.EmployeeId;
        }
    }
}
