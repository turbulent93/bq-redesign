using BeautyQueenApi.Models;
using BqApi.Requests.Users;

namespace BqApi.Services.UploadService
{
    public class FileDto
    {
        public int Id { get; set; }
        public string Path { get; set; } = null!;
        public string Name { get; set; } = null!;
    }
}
