using BeautyQueenApi.Data;
using Microsoft.EntityFrameworkCore;
using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;

namespace BqApi.TgBot
{
    public class TgBotService(IConfiguration configuration, ApplicationDbContext context) : ITgBotService
    {
        private readonly TgBotSettings? _settings = configuration?.GetSection(nameof(TgBotSettings)).Get<TgBotSettings>();
        private readonly ApplicationDbContext _context = context;

        public async Task Update(Update update)
        {
            var bot = new TelegramBotClient(_settings?.Token!);

            if(update.Message?.Text != null && update.Message.Text.Contains("/start"))
            {
                var authCode = update.Message.Text.Split(" ")[1];

                if (authCode == null)
                    return;

                var item = await _context.Employee.FirstOrDefaultAsync(i => i.AuthTgCode == authCode);

                if (item == null)
                    return;

                item.UpdateChatId(update.Message.Chat.Id.ToString());

                await _context.SaveChangesAsync();

                await bot.SendTextMessageAsync(update.Message.Chat.Id, "Уведомления подключены!");
            }
        }

        public async Task SendMessage(string chatId, string message)
        {
            var bot = new TelegramBotClient(_settings?.Token!);

            await bot.SendTextMessageAsync(chatId, message);
        }
    }
}
