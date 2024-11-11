using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Schedules;
using BeautyQueenApi.Requests.Services;
using BqApi.Requests.Users;

namespace BeautyQueenApi.Requests.Promos
{
    public class PromoServiceDto
    {
        public int? Id { get; set; }
        public int PromoId { get; set; }
        public int ServiceId { get; set; }
        public int Discount { get; set; }
        public string Unit { get; set; } = null!;

        //public PromoDto? Promo { get; set; }
        public ServiceDto? Service { get; set; }
    }
}
