using BqApi.Services.UploadService;

namespace BeautyQueenApi.Services.UploadService
{
    public interface IUploadService
    {
        Task<FileDto> ViewAsync(int id);
        public Task<FileDto> UploadAsync(UploadDto request);
        public Task RemoveAsync(int id);
    }
}