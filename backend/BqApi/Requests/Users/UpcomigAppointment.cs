namespace BqApi.Requests.Users
{
    public class UpcomigAppointment(int scheduleId, string date, string startAt, string endAt)
    {
        public int ScheduleId { get; set; } = scheduleId;
        public string Date { get; set; } = date;
        public string StartAt { get; set; } = startAt;
        public string EndAt { get; set; } = endAt;
    }
}
