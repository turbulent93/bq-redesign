using BeautyQueenApi.Data;
using BqApi.Constants;
using BqApi.Models;
using BqApi.Services.UploadService;
using Mapster;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

namespace BeautyQueenApi.Services.UploadService
{
    public class UploadService : IUploadService
    {
        private readonly IWebHostEnvironment _appEnvironment;
        private readonly ApplicationDbContext _context;
        public UploadService(IWebHostEnvironment appEnvironment, ApplicationDbContext context)
        {
            _appEnvironment = appEnvironment;
            _context = context;
        }

        public async Task<FileDto> ViewAsync(int id)
        {
            var item = await _context.File.FirstOrDefaultAsync(i => i.Id == id)
                ?? throw new Exception(ErrorMessages.FILE_ERROR);

            return item.Adapt<FileDto>();
        }

        public async Task<FileDto> UploadAsync(UploadDto request)
        {
            //if(!Directory.Exists(_appEnvironment.WebRootPath))
            //{
            //    Directory.CreateDirectory(_appEnvironment.WebRootPath);
            //}

            //var dirPath = Path.Combine(
            //    _appEnvironment.WebRootPath,
            //    "files");

            //if(!Directory.Exists(dirPath)) {
            //    Directory.CreateDirectory(dirPath);
            //}

            string fileName = Guid.NewGuid() + Path.GetExtension(request.File.FileName);
            string path = Path.Combine(_appEnvironment.WebRootPath, "files", fileName);

            using var fileStream = new FileStream(path, FileMode.Create);
            await request.File.CopyToAsync(fileStream);

            var item = new UploadedFile
            {
                Path = Path.Combine("files", fileName),
                Name = request.File.Name
            };

            _context.File.Add(item);

            await _context.SaveChangesAsync();

            return item.Adapt<FileDto>();
        }

        public async Task RemoveAsync(int id)
        {
            var item = await _context.File.FirstOrDefaultAsync(i => i.Id == id)
                ?? throw new Exception(ErrorMessages.FILE_ERROR);

            if (File.Exists(item.Path))
            {
                File.Delete(item.Path);

                _context.File.Remove(item);

                await _context.SaveChangesAsync();
            } else
            {
                throw new Exception(ErrorMessages.FILE_ERROR);
            }
        }
    }
}