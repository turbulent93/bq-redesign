using BeautyQueenApi.Data;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.PunchMaps
{
    public class RemovePunchMapRequest : IRequest<PunchMapDto> {
        public int Id { get; set; }
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<RemovePunchMapRequest, PunchMapDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<PunchMapDto> Handle(
                RemovePunchMapRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context
                        .PunchMap
                        .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                    ?? throw new Exception(ErrorMessages.PUNCH_MAP_ERROR);

                _context.PunchMap.Remove(item);
                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<PunchMapDto>();
            }
        }
    }
}