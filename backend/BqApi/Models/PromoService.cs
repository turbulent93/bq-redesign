using BeautyQueenApi.Requests.Promos;
using BeautyQueenApi.Requests.Schedules;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BeautyQueenApi.Models
{
    public class PromoService(int promoId, int serviceId, int discount)
    {
        [Key]
        public int Id { get; set; }
        public int PromoId { get; set; } = promoId;
        public int ServiceId { get; set; } = serviceId;
        public int Discount { get; set; } = discount;
        public string Unit { get; set; } = "р";

        public Promo Promo { get; set; } = null!;
        public Service Service { get; set; } = null!;

        public void Update(PromoServiceDto item)
        {
            PromoId = item.PromoId;
            ServiceId = item.ServiceId;
            Discount = item.Discount;
            //Unit = item.Unit;
        }
    }
}
