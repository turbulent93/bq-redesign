using BeautyQueenApi.Data;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.PunchMaps
{
    public class ViewPunchMapRequest : IRequest<PunchMapDto> {
        public int Id { get; set; }
        
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<ViewPunchMapRequest, PunchMapDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<PunchMapDto> Handle(
                ViewPunchMapRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context
                    .PunchMap
                    .Include(i => i.PunchMapPromos)
                    .ThenInclude(i => i.Promo)
                    .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                        ?? throw new Exception(ErrorMessages.PUNCH_MAP_ERROR);

                return item.Adapt<PunchMapDto>();
            }
        }
    }
}