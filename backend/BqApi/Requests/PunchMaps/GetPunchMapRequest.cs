using BeautyQueenApi.Data;
using BeautyQueenApi.Requests.Pagination;
using BqApi.Models;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.PunchMaps
{
    public class GetPunchMapRequest : PaginationRequest, IRequest<PaginationResponse<PunchMapDto>> {
        public class Handler(ApplicationDbContext context) : IRequestHandler<GetPunchMapRequest, PaginationResponse<PunchMapDto>> {
            private readonly ApplicationDbContext _context = context;

            public async Task<PaginationResponse<PunchMapDto>> Handle(
                GetPunchMapRequest request, CancellationToken cancellationToken
            ) {
                var items = await _context
                    .PunchMap
                    .Include(i => i.PunchMapPromos)
                    .ThenInclude(i => i.Promo)
                    .ToListAsync(cancellationToken);

                return new PaginationResponse<PunchMapDto>(
                    items.Adapt<List<PunchMapDto>>(),
                    request.Page,
                    request.Size);
            }
        }
    }
}