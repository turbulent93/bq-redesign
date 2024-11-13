using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.ServiceGroups;
using BeautyQueenApi.Requests.Services;
using BeautyQueenApi.Requests.Specializations;
using BqApi.Models;
using BqApi.Services.UploadService;

namespace BeautyQueenApi.Requests.GalleryItem
{
    public class GalleryDto
    {
        public int? Id { get; set; }
        public int ImageId { get; set; }
        public int ServiceId { get; set; }

        public ServiceDto Service { get; set; } = null!;
        public FileDto Image { get; set; } = null!;
    }
}
