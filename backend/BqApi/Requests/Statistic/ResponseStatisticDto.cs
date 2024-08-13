namespace BqApi.Requests.Statistic
{
    public class ResponseStatisticDto
    {
        public int RevenueCount { get; set; }
        public StatisticDto Revenue { get; set; } = null!;
        public StatisticDto Applications { get; set; } = null!;
        public StatisticDto Services { get; set; } = null!;
    }
}
