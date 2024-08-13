using Parlot.Fluent;
using Telegram.Bot;

// https://api.telegram.org/bot7404749423:AAHR0ok9_vzHi_9pEFCwmBPPs-YkVE9YC8Q/setWebhook?url=https://46fa8081-0ef3-4aa5-bea9-f20276926122.tunnel4.com

namespace BqApi.TgBot
{
    public class TgBot
    {
        private static TelegramBotClient Client { get; set; } = null!;

        public static TelegramBotClient GetTelegramBot()
        {
            if (Client != null)
            {
                return Client;
            }
            Client = new TelegramBotClient("7404749423:AAHR0ok9_vzHi_9pEFCwmBPPs-YkVE9YC8Q");

            //await Client.SetWebhookAsync("http://487402ed-aa83-45e5-97be-71fac22596c8.tunnel4.com");

            Client.GetUpdatesAsync();

            return Client;
        }

        //public static Task StartListening()
        //{
            //Client.GetUpdatesAsync(Update);
        //}
    }
}
