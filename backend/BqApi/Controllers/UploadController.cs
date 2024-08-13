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
    public class UploadController(IUploadService uploadService) : ControllerBase
    {
        private readonly IUploadService _uploadService = uploadService;

        [HttpGet]
        public async Task<ActionResult<FileDto>> View(int id)
        {
            return await _uploadService.ViewAsync(id);
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
