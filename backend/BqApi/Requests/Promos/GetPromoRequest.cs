using BeautyQueenApi.Data;
using BeautyQueenApi.Requests.Pagination;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Promos
{
    public class GetPromoRequest : PaginationRequest, IRequest<PaginationResponse<PromoDto>> {
        public class Handler(ApplicationDbContext context) : IRequestHandler<GetPromoRequest, PaginationResponse<PromoDto>> {
            private readonly ApplicationDbContext _context = context;

            public async Task<PaginationResponse<PromoDto>> Handle(
                GetPromoRequest request, CancellationToken cancellationToken
            ) {
                var items = await _context
                    .Promo
                    .Include(i => i.Image)
                    .ToListAsync(cancellationToken);

                return new PaginationResponse<PromoDto>(
                    items.Adapt<List<PromoDto>>(),
                    request.Page,
                    request.Size);
            }
        }
    }
}