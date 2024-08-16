using BeautyQueenApi.Data;
using BqApi.Constants;
using BqApi.Models;
using BqApi.Services.UploadService;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Services.UploadService
{
    public class UploadService : IUploadService
    {
        private readonly UploadSettings _settings;
        private readonly ApplicationDbContext _context;
        public UploadService(IConfiguration _config, ApplicationDbContext context)
        {
            _settings = _config.GetSection(nameof(UploadSettings)).Get<UploadSettings>()!;
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
            string fileName = Guid.NewGuid() + Path.GetExtension(request.File.FileName);
            string path = Path.Combine(_settings.UploadPath, "files", fileName);

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

            if (File.Exists(Path.Combine(_settings.UploadPath, item.Path)))
            {
                File.Delete(Path.Combine(_settings.UploadPath, item.Path));

                _context.File.Remove(item);

                await _context.SaveChangesAsync();
            } else
            {
                throw new Exception(ErrorMessages.FILE_ERROR);
            }
        }
    }
}