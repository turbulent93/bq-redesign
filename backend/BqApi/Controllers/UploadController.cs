using BeautyQueenApi.Data;
using BeautyQueenApi.Requests.Pagination;
using BeautyQueenApi.Requests.Users;
using BeautyQueenApi.Services.UploadService;
using BqApi.Requests.Users;
using BqApi.Services.UploadService;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BeautyQueenApi.Controllers
{
    [Route("api/upload")]
    [ApiController]
    public class UploadController(IUploadService uploadService, IConfiguration _config) : ControllerBase
    {
        private readonly IUploadService _uploadService = uploadService;
        private readonly UploadSettings _settings = _config.GetSection(nameof(UploadSettings)).Get<UploadSettings>()!;

        [HttpGet]
        public async Task<ActionResult<FileDto>> View(int id)
        {
            return await _uploadService.ViewAsync(id);
        }

        [HttpGet("download")]
        public IActionResult Download(string filePath)
        {
            var path = Path.Combine(_settings.UploadPath, filePath);
            var fs = new FileStream(path, FileMode.Open);

            return File(fs, "application/octet-stream", filePath.Split('\\')[1]);
        }

        [HttpPost]
        public async Task<ActionResult<FileDto>> Upload(UploadDto request)
        {
            return await _uploadService.UploadAsync(request);
        }

        [HttpDelete("{id}")]
        public async Task Remove(int id)
        {
            await _uploadService.RemoveAsync(id);
        }
    }
}
