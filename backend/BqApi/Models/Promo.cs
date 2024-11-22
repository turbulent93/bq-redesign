using System.ComponentModel.DataAnnotations;
using System.Globalization;
using BeautyQueenApi.Requests.Promos;
using BeautyQueenApi.Requests.Services;
using BqApi.Models;
using BqApi.Models.Audit;

namespace BeautyQueenApi.Models
{
    public class Promo(string title, string description, DateOnly? startDate, DateOnly? endDate, int? bonusCount, string? type, int imageId, bool showOnHomePage)
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; } = title;
        public string Description { get; set; } = description;
        public DateOnly? StartDate { get; set; } = startDate;
        public DateOnly? EndDate { get; set; } = endDate;
        public int? BonusCount { get; set; } = bonusCount;
        public string? Type { get; set; } = type;
        public int ImageId { get; set; } = imageId;
        public bool ShowOnHomePage { get; set; } = showOnHomePage;

        public List<PromoService> PromoServices { get; set; } = null!;
        public UploadedFile Image { get; set; } = null!;
        public List<User> Users { get; set; } = null!;

        public void Update(PromoDto request)
        {
            var isStartDateCorrect = DateOnly.TryParseExact(request.StartDate, "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly startDate);
            var isEndDateCorrect = DateOnly.TryParseExact(request.EndDate, "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly endDate);

            Title = request.Title;
            Description = request.Description;
            StartDate = isStartDateCorrect ? startDate : null;
            EndDate = isEndDateCorrect ? endDate : null;
            ImageId = request.ImageId;
            ShowOnHomePage = request.ShowOnHomePage;
            Type = request.Type;
            BonusCount = request.BonusCount;
        }
    }
}
