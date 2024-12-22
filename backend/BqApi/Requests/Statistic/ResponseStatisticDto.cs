namespace BqApi.Requests.Statistic
{
    public class ResponseStatisticDto
    {
        public int RevenueCount { get; set; }
        public int NewUsersCount { get; set; }
        public StatisticDto Revenue { get; set; } = null!;
        public StatisticDto Appointments { get; set; } = null!;
        public StatisticDto Services { get; set; } = null!;
        public StatisticDto Weekdays { get; set; } = null!;
        public StatisticDto Promos { get; set; } = null!;
    }
}
