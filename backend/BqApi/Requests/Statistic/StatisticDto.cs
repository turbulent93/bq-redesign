namespace BqApi.Requests.Statistic
{
    public class StatisticDto
    {
        public List<string> Labels { get; set; } = null!;
        public List<int> Values { get; set; } = null!;
    }
}
