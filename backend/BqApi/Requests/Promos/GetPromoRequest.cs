using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Pagination;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Promos
{
    public class GetPromoRequest : PaginationRequest, IRequest<PaginationResponse<PromoDto>> {
        public bool? ShowOnHomePage { get; set; }
        public bool? OnlyCurrent { get; set; }
        public string? Type { get; set; }

        public class Handler(ApplicationDbContext context) : IRequestHandler<GetPromoRequest, PaginationResponse<PromoDto>> {
            private readonly ApplicationDbContext _context = context;

            public async Task<PaginationResponse<PromoDto>> Handle(
                GetPromoRequest request, CancellationToken cancellationToken
            ) {
                IQueryable<Promo> items = _context
                    .Promo
                    .Include(i => i.Image);

                if(request.ShowOnHomePage == true)
                {
                    items = items.
                        Where(i => i.ShowOnHomePage);
                }

                if (request.Type != null)
                {
                    items = items.
                        Where(i => i.Type == request.Type);
                }

                if (request.OnlyCurrent == true)
                {
                    items = items.
                        Where(i => (i.StartDate == null
                            || DateOnly.FromDateTime(DateTime.Now).CompareTo(i.StartDate.Value) > 0)
                            && (i.EndDate == null
                            || DateOnly.FromDateTime(DateTime.Now).CompareTo(i.EndDate.Value) < 0));
                }

                return new PaginationResponse<PromoDto>(
                    (await items.ToListAsync(cancellationToken)).Adapt<List<PromoDto>>(),
                    request.Page,
                    request.Size);
            }
        }
    }
}