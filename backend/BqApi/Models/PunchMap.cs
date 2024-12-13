using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.GalleryItem;
using BeautyQueenApi.Requests.PunchMaps;
using BqApi.Models.Audit;
using BqApi.Services.UploadService;
using System.ComponentModel.DataAnnotations;

namespace BqApi.Models
{
    public class PunchMap(int? employeeId, int stepsCount, int columnsCount)// : TrackedEntity
    {
        [Key]
        public int Id { get; set; }
        public int? EmployeeId { get; set; } = employeeId;
        public int StepsCount { get; set; } = stepsCount;
        public int ColumnsCount { get; set; } = columnsCount;

        public User Employee { get; set; } = null!;
        public List<User> Clients { get; set; } = null!;
        public List<PunchMapPromo> PunchMapPromos { get; set; } = null!;

        public void Update(PunchMapDto request)
        {
            EmployeeId = request.EmployeeId;
            StepsCount = request.StepsCount;
            ColumnsCount = request.ColumnsCount;
        }
    }
}
