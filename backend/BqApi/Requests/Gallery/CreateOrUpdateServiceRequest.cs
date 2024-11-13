using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BqApi.Constants;
using BqApi.Models;
using BqApi.Services.UploadService;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.GalleryItem
{
    public class CreateOrUpdateGalleryRequest : IRequest<List<GalleryDto>> {
        public int? Id { get; set; }
        public List<int> Images { get; set; } = null!;
        public int ServiceId { get; set; }

        public class Handler(ApplicationDbContext context) : IRequestHandler<CreateOrUpdateGalleryRequest, List<GalleryDto>> {
            private readonly ApplicationDbContext _context = context;

            public async Task<List<GalleryDto>> Handle(
                CreateOrUpdateGalleryRequest request, CancellationToken cancellationToken
            ) {
                if (request.Id != null)
                {
                    var g = await _context
                        .Gallery
                        .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                            ?? throw new Exception(ErrorMessages.SERVICE_ERROR);

                    g.Update(request);
                } else
                {
                    foreach (var item in request.Images)
                    {
                        Gallery g = new(item, request.ServiceId);

                        _context.Gallery.Add(g);
                    }
                }

                await _context.SaveChangesAsync(cancellationToken);

                return new List<GalleryDto>();
            }
        }
    }
}