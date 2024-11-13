using BeautyQueenApi.Constants;
using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Pagination;
using BeautyQueenApi.Services.TokenService;
using BqApi.Services.TokenService;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BeautyQueenApi.Requests.GalleryItem
{
    public class GetGalleryRequest : PaginationRequest, IRequest<PaginationResponse<GalleryDto>> {

        public class Handler(ApplicationDbContext context
        ) : IRequestHandler<GetGalleryRequest, PaginationResponse<GalleryDto>> {
            private readonly ApplicationDbContext _context = context;

            public async Task<PaginationResponse<GalleryDto>> Handle(
                GetGalleryRequest request, CancellationToken cancellationToken
            ) {
                var items = await _context
                    .Gallery
                    .Include(i => i.Image)
                    .ToListAsync(cancellationToken);

                return new PaginationResponse<GalleryDto>(
                    items.Adapt<List<GalleryDto>>(),
                    request.Page,
                    request.Size);
            }
        }
    }
}