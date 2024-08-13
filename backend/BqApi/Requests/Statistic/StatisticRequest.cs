using BqApi.Services.StatisticService;
using MediatR;

namespace BqApi.Requests.Statistic
{
    public class StatisticRequest : IRequest<ResponseStatisticDto>
    {
        public string? StartDate { get; set; } = null!;
        public string? EndDate { get; set; } = null!;
        public int? EmployeeId { get; set; }
    }
}
