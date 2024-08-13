using Telegram.Bot.Types;

namespace BqApi.TgBot
{
    public interface ITgBotService
    {
        Task Update(Update update);
        Task SendMessage(string chatId,  string message);
    }
}
