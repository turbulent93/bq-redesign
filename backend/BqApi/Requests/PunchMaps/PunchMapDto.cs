using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Schedules;
using BeautyQueenApi.Requests.Services;
using BqApi.Requests.Users;
using BqApi.Services.UploadService;
using static System.Net.Mime.MediaTypeNames;

namespace BeautyQueenApi.Requests.PunchMaps
{
    public class PunchMapDto
    {
        public int? Id { get; set; }
        public int? EmployeeId { get; set; }
        public int StepsCount { get; set; }
        public int ColumnsCount { get; set; }

        public List<PunchMapPromoDto> PunchMapPromos { get; set; } = null!;
    }
}
