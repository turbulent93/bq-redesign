using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.GalleryItem;
using BqApi.Models.Audit;
using BqApi.Services.UploadService;
using System.ComponentModel.DataAnnotations;

namespace BqApi.Models
{
    public class Gallery(int imageId, int serviceId) : TrackedEntity
    {
        [Key]
        public int Id { get; set; }
        public int ImageId { get; set; } = imageId;
        public int ServiceId { get; set; } = serviceId;

        public Service Service { get; set; } = null!;
        public UploadedFile Image { get; set; } = null!;

        public void Update(CreateOrUpdateGalleryRequest request)
        {
            ImageId = request.Images[0];
            ServiceId = request.ServiceId;
        }
    }
}
