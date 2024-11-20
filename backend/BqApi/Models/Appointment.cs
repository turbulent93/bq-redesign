using BeautyQueenApi.Requests.Appointments;
using BqApi.Models.Audit;
using System.ComponentModel.DataAnnotations;

namespace BeautyQueenApi.Models
{
    public class Appointment(int userId, TimeOnly startAt, TimeOnly endAt, int employeeId, int scheduleId, int serviceId, int paidWithBonuses, int? promoId) : TrackedEntity
    {
        [Key]
        public int Id { get; set; }
        public TimeOnly StartAt { get; set; } = startAt;
        public TimeOnly EndAt { get; set; } = endAt;
        public int EmployeeId { get; set; } = employeeId;
        public int ScheduleId { get; set; } = scheduleId;
        public int ServiceId { get; set; } = serviceId;
        public int UserId { get; set; } = userId;
        public int PaidWithBonuses { get; set; } = (int)paidWithBonuses;
        public int? PromoId { get; set; } = promoId;

        public Employee Employee { get; set; } = null!;
        public Schedule Schedule { get; set; } = null!;
        public Service Service { get; set; } = null!;
        public User User { get; set; } = null!;
        public Promo Promo { get; set; } = null!;
    }
}
