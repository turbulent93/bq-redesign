using System.ComponentModel.DataAnnotations;
using BeautyQueenApi.Requests.Services;
using BqApi.Models.Audit;

namespace BeautyQueenApi.Models
{
    public class Service(string name, int price, int duration, int specializationId, int groupId) : TrackedEntity
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = name;
        public int Price { get; set; } = price;
        public int Duration { get; set; } = duration;
        public int SpecializationId { get; set; } = specializationId;
        public int GroupId { get; set; } = groupId;

        public Specialization Specialization { get; set; } = null!;
        public ServiceGroup Group { get; set; } = null!;
        public List<PromoService> PromoServices { get; set; } = null!;

        public void Update(CreateOrUpdateServiceRequest request) {
            Name = request.Name;
            Price = request.Price;
            Duration = request.Duration;
            SpecializationId = request.SpecializationId;
        }
    }
}
