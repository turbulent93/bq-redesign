using BeautyQueenApi.Requests.Appointments;
using BqApi.Models.Audit;
using System.ComponentModel.DataAnnotations;

namespace BeautyQueenApi.Models
{
    public class Appointment(string phone, TimeOnly startAt, TimeOnly endAt, int employeeId,int scheduleId, int serviceId) : TrackedEntity
    {
        [Key]
        public int Id { get; set; }
        public string Phone { get; set; } = phone;
        public TimeOnly StartAt { get; set; } = startAt;
        public TimeOnly EndAt { get; set; } = endAt;
        public int EmployeeId { get; set; } = employeeId;
        public int ScheduleId { get; set; } = scheduleId;
        public int ServiceId { get; set; } = serviceId;

        public Employee Employee { get; set; } = null!;
        public Schedule Schedule { get; set; } = null!;
        public Service Service { get; set; } = null!;
        public List<User> Appointments { get; set; } = null!;
    }
}
