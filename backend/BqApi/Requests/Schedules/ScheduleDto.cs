namespace BeautyQueenApi.Requests.Schedules
{
    public class ScheduleDto
    {
        public int? Id { get; set; }
        public string Date { get; set; } = null!;
        public string StartAt { get; set; } = null!;
        public string EndAt { get; set; } = null!;
        public int EmployeeId { get; set; }
    }
}
