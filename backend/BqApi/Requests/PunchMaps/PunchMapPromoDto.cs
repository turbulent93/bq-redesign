using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Promos;
using BeautyQueenApi.Requests.Schedules;
using BeautyQueenApi.Requests.Services;
using BqApi.Requests.Users;
using BqApi.Services.UploadService;

namespace BeautyQueenApi.Requests.PunchMaps
{
    public class PunchMapPromoDto
    {
        public int? Id { get; set; }
        public int PunchMapId { get; set; }
        public int PromoId { get; set; }
        public int Step { get; set; }

        public PromoDto? Promo { get; set; }
    }
}
