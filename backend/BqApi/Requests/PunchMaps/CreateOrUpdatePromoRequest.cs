using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BqApi.Constants;
using BqApi.Models;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.PunchMaps
{
    public class CreateOrUpdatePunchMapRequest : PunchMapDto, IRequest<PunchMapDto> {
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<CreateOrUpdatePunchMapRequest, PunchMapDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<PunchMapDto> Handle(
                CreateOrUpdatePunchMapRequest request, CancellationToken cancellationToken
            )
            {
                PunchMap? item;
                if (request.Id != null)
                {
                    item = await _context
                        .PunchMap
                        .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                            ?? throw new Exception(ErrorMessages.PUNCH_MAP_ERROR);

                    foreach (PunchMapPromoDto ppd in request.PunchMapPromos)
                    {
                        PunchMapPromo? pp;

                        if(ppd.Id != null)
                        {
                            pp = await _context
                                .PunchMapPromo
                                .FirstOrDefaultAsync(i => i.Id == ppd.Id, cancellationToken)
                                    ?? throw new Exception(ErrorMessages.PUNCH_MAP_ERROR);

                            pp.Update(ppd);
                        } else
                        {
                            pp = new(item.Id,
                                ppd.PromoId,
                                ppd.Step);

                            _context.PunchMapPromo.Add(pp);
                        }
                    }

                    item.Update(request);
                }
                else
                {
                    item = new(request.EmployeeId, request.StepsCount, request.ColumnsCount);

                    _context.PunchMap.Add(item);

                    await _context.SaveChangesAsync(cancellationToken);

                    foreach (PunchMapPromoDto ppd in request.PunchMapPromos)
                    {
                        PunchMapPromo? pp = new(item.Id,
                            ppd.PromoId,
                            ppd.Step);

                        _context.PunchMapPromo.Add(pp);
                    }
                }

                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<PunchMapDto>();
            }
        }
    }
}