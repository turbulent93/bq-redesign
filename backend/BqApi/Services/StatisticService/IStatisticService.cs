using BqApi.Requests.Statistic;

namespace BqApi.Services.StatisticService
{
    public interface IStatisticService
    {
        Task<ResponseStatisticDto> Get(StatisticRequest request);
        Task<ResponseProfileStatisticDto> GetProfile(RequestProfileStatisticDto request);
    }
}
