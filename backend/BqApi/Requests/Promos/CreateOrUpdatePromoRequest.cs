using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace BeautyQueenApi.Requests.Promos
{
    public class CreateOrUpdatePromoRequest : PromoDto, IRequest<PromoDto> {
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<CreateOrUpdatePromoRequest, PromoDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<PromoDto> Handle(
                CreateOrUpdatePromoRequest request, CancellationToken cancellationToken
            )
            {
                Promo? item;
                if (request.Id != null)
                {
                    item = await _context
                        .Promo
                        .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                            ?? throw new Exception(ErrorMessages.PROMO_ERROR);

                    foreach (PromoServiceDto psd in request.PromoServices)
                    {
                        PromoService? ps;

                        if(psd.Id != null)
                        {
                            ps = await _context
                                .PromoService
                                .FirstOrDefaultAsync(i => i.Id == psd.Id, cancellationToken)
                                    ?? throw new Exception(ErrorMessages.PROMO_ERROR);

                            ps.Update(psd);
                        } else
                        {
                            ps = new(item.Id,
                            psd.ServiceId,
                            psd.Discount);

                            _context.PromoService.Add(ps);
                        }
                    }

                    item.Update(request);
                }
                else
                {
                    var isStartDateCorrect = DateOnly.TryParseExact(request.StartDate, "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly startDate);
                    var isEndDateCorrect = DateOnly.TryParseExact(request.EndDate, "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly endDate);

                    var isStartAtCorrect = TimeOnly.TryParseExact(request.StartDate, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly startAt);
                    var isEndAtCorrect = TimeOnly.TryParseExact(request.EndDate, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly endAt);

                    item = new(request.Title,
                        request.Description,
                        isStartDateCorrect ? startDate : null,
                        isEndDateCorrect ? endDate : null,
                        request.BonusCount,
                        request.Type,
                        request.ImageId,
                        request.ShowOnHomePage,
                        isStartAtCorrect ? startAt : null,
                        isEndAtCorrect ? endAt : null,
                        request.AllowedWeekDays);

                    _context.Promo.Add(item);

                    await _context.SaveChangesAsync(cancellationToken);

                    foreach (PromoServiceDto psd in request.PromoServices)
                    {
                        PromoService? ps = new(item.Id,
                            psd.ServiceId,
                            psd.Discount);

                        _context.PromoService.Add(ps);
                    }
                }

                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<PromoDto>();
            }
        }
    }
}