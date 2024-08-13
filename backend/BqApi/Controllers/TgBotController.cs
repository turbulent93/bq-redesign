using BeautyQueenApi.Requests.Pagination;
using BeautyQueenApi.Requests.Services;
using BeautyQueenApi.Requests.Specializations;
using BqApi.TgBot;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Telegram.Bot;
using Telegram.Bot.Types;

namespace BeautyQueenApi.Controllers
{

    [Route("bot")]
    [ApiController]
    public class TgBotController(ITgBotService botService) : ControllerBase
    {
        private readonly ITgBotService _botService = botService;

        [HttpPost("update")]
        [AllowAnonymous]
        public async Task Update(Update update)
        {
            await _botService.Update(update);
        }
    }
}
