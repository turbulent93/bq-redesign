using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Schedules;
using BeautyQueenApi.Requests.Services;
using BqApi.Requests.Users;
using BqApi.Services.UploadService;

namespace BeautyQueenApi.Requests.Promos
{
    public class PromoDto
    {
        public int? Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string? StartDate { get; set; } = null!;
        public string? EndDate { get; set; } = null!;
        public int? BonusCount { get; set; }
        public string? Type { get; set; }
        public int ImageId { get; set; }
        public bool ShowOnHomePage { get; set; }
        public string? StartAt { get; set; }
        public string? EndAt { get; set; }
        public string? AllowedWeekDays { get; set; }

        public FileDto? Image { get; set; }
        public List<PromoServiceDto> PromoServices { get; set; } = null!;
    }
}
