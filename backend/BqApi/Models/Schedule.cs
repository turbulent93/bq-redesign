using BeautyQueenApi.Requests.Schedules;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
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

        public User Employee { get; set; } = null!;

        public List<Appointment>? Appointments { get; set; }

        public void Update(CreateOrUpdateScheduleRequest request)
        {
            DateOnly.TryParseExact(request.Date, "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly date);
            TimeOnly.TryParseExact(request.StartAt, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly startAt);
            TimeOnly.TryParseExact(request.EndAt, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly endAt);

            Date = date;
            StartAt = startAt;
            EndAt = endAt;
            EmployeeId = request.EmployeeId;
        }
    }
}
