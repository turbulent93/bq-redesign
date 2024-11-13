using System.ComponentModel.DataAnnotations;
using BeautyQueenApi.Requests.Promos;
using BeautyQueenApi.Requests.Services;
using BqApi.Models;
using BqApi.Models.Audit;

namespace BeautyQueenApi.Models
{
    public class Promo(string title, string description, DateOnly startDate, DateOnly endDate, int? bonusCount, string? type, int imageId)
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; } = title;
        public string Description { get; set; } = description;
        public DateOnly StartDate { get; set; } = startDate;
        public DateOnly EndDate { get; set; } = endDate;
        public int? BonusCount { get; set; } = bonusCount;
        public string? Type { get; set; } = type;
        public int ImageId { get; set; } = imageId;

        public List<PromoService> PromoServices { get; set; } = null!;
        public UploadedFile Image { get; set; } = null!;

        public void Update(PromoDto request)
        {
            Title = request.Title;
            Description = request.Description;
            StartDate = DateOnly.Parse(request.StartDate);
            EndDate = DateOnly.Parse(request.EndDate);
            ImageId = request.ImageId;
        }
    }
}
