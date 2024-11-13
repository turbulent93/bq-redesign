using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.GalleryItem
{
    public class RemoveGalleryRequest : IRequest<GalleryDto> {
        public int Id { get; set; }
        public class Handler(ApplicationDbContext context) : IRequestHandler<RemoveGalleryRequest, GalleryDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<GalleryDto> Handle(
                RemoveGalleryRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context.Gallery.FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                    ?? throw new Exception(ErrorMessages.SERVICE_ERROR);

                _context.Gallery.Remove(item);
                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<GalleryDto>();
            }
        }
    }
}