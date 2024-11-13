using BeautyQueenApi.Data;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.GalleryItem
{
    public class ViewGalleryRequest : IRequest<GalleryDto> {
        public int Id { get; set; }
        
        public class Handler(ApplicationDbContext context) : IRequestHandler<ViewGalleryRequest, GalleryDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<GalleryDto> Handle(
                ViewGalleryRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context.Service.FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                    ?? throw new Exception(ErrorMessages.SERVICE_ERROR);

                return item.Adapt<GalleryDto>();
            }
        }
    }
}