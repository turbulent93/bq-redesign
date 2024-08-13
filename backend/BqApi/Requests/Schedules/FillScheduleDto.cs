namespace BqApi.Requests.Schedules
{
    public class FillScheduleDto
    {
        public int EmployeeId { get; set; }
        public string StartDate { get; set; } = null!;
        public string EndDate { get; set; } = null!;
        public string FillType { get; set; } = "DEFAULT";
        public int WorkDays { get; set; } = 2;
        public int WeekendDays { get; set; } = 2;
        public string StartAt { get; set; } = null!;
        public string EndAt { get; set; } = null!;
        public bool RemoveApplications { get; set; }
    }
}
