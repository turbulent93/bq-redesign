using BeautyQueenApi.Requests.Pagination;
using BeautyQueenApi.Requests.Tokens;
using BeautyQueenApi.Requests.Users;
using BeautyQueenApi.Services.TokenService;
using BqApi.Requests.Statistic;
using BqApi.Services.StatisticService;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BeautyQueenApi.Controllers
{
    [Route("api/statistic")]
    [ApiController]
    public class StatisticController(IStatisticService statisticService) : ControllerBase
    {
        private readonly IStatisticService _statisticService = statisticService;

        [HttpPost()]
        public async Task<ActionResult<ResponseStatisticDto>> Get(StatisticRequest request)
        {
            return await _statisticService.Get(request);
        }

        [HttpPost("profile")]
        public async Task<ActionResult<ResponseProfileStatisticDto>> GetProfile(RequestProfileStatisticDto request)
        {
            return await _statisticService.GetProfile(request);
        }
    }
}
