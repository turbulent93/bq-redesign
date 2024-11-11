using BeautyQueenApi.Data;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Promos
{
    public class RemovePromoRequest : IRequest<PromoDto> {
        public int Id { get; set; }
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<RemovePromoRequest, PromoDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<PromoDto> Handle(
                RemovePromoRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context
                        .Promo
                        .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                    ?? throw new Exception(ErrorMessages.PROMO_ERROR);

                _context.Promo.Remove(item);
                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<PromoDto>();
            }
        }
    }
}