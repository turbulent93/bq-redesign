using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.PunchMaps;
using BeautyQueenApi.Requests.Schedules;
using BeautyQueenApi.Requests.Services;
using BqApi.Models;
using BqApi.Requests.Users;
using BqApi.Services.UploadService;

namespace BeautyQueenApi.Models
{
    public class PunchMapPromo(int punchMapId, int promoId, int step)
    {
        public int? Id { get; set; }
        public int PunchMapId { get; set; } = punchMapId;
        public int PromoId { get; set; } = promoId;
        public int Step { get; set; } = step;

        public PunchMap PunchMap { get; set; } = null!;
        public Promo Promo { get; set; } = null!;

        public void Update(PunchMapPromoDto request)
        {
            PunchMapId = request.PunchMapId;
            PromoId = request.PromoId;
            Step = request.Step;
        }
    }
}
