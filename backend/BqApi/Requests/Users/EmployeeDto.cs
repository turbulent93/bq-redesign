using BeautyQueenApi.Requests.Services;
using BeautyQueenApi.Requests.Specializations;
using BqApi.Services.UploadService;

namespace BqApi.Requests.Users
{
    public class EmployeeDto
    {
        public int? Id { get; set; }
        public string FullName { get; set; } = null!;
        public int UserId { get; set; }
        public int FileId { get; set; }
        public bool? NotificationsEnabled { get; set; }
        public string? AuthTgCode { get; set; }
        public string? TgChatId { get; set; }

        public List<int> SpecializationIds { get; set; } = null!;

        public List<SpecializationDto>? Specializations { get; set; }
        public FileDto? File { get; set; }
    }
}
