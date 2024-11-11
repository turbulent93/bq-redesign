using BeautyQueenApi.Data;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Promos
{
    public class ViewPromoRequest : IRequest<PromoDto> {
        public int Id { get; set; }
        
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<ViewPromoRequest, PromoDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<PromoDto> Handle(
                ViewPromoRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context
                    .Promo
                    .Include(i => i.PromoServices)
                    .ThenInclude(i => i.Service)
                    .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                        ?? throw new Exception(ErrorMessages.PROMO_ERROR);

                return item.Adapt<PromoDto>();
            }
        }
    }
}