using BeautyQueenApi.Requests.Appointments;
using BqApi.Models.Audit;
using System.ComponentModel.DataAnnotations;

namespace BeautyQueenApi.Models
{
    public class Appointment(int clientId, TimeOnly startAt, TimeOnly endAt, int employeeId, int scheduleId, int serviceId, int paidWithBonuses, int? promoId)// : TrackedEntity
    {
        [Key]
        public int Id { get; set; }
        public TimeOnly StartAt { get; set; } = startAt;
        public TimeOnly EndAt { get; set; } = endAt;
        public int EmployeeId { get; set; } = employeeId;
        public int ScheduleId { get; set; } = scheduleId;
        public int ServiceId { get; set; } = serviceId;
        public int ClientId { get; set; } = clientId;
        public int PaidWithBonuses { get; set; } = (int)paidWithBonuses;
        public int? PromoId { get; set; } = promoId;

        public User Employee { get; set; } = null!;
        public Schedule Schedule { get; set; } = null!;
        public Service Service { get; set; } = null!;
        public User Client { get; set; } = null!;
        public Promo Promo { get; set; } = null!;
    }
}
