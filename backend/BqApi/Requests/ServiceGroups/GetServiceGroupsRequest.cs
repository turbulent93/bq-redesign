using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Pagination;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.ServiceGroups
{
    public class GetServiceGroupRequest : PaginationRequest, IRequest<PaginationResponse<ServiceGroupDto>> {
        public int? EmployeeId { get; set; }
        public int[]? ExludedIds { get; set; }
        public int? PromoId { get; set; }
        public string? ServiceName { get; set; }

        public class Handler(ApplicationDbContext context
        ) : IRequestHandler<GetServiceGroupRequest, PaginationResponse<ServiceGroupDto>> {
            private readonly ApplicationDbContext _context = context;

            public async Task<PaginationResponse<ServiceGroupDto>> Handle(
                GetServiceGroupRequest request, CancellationToken cancellationToken
            ) {
                var items = (await _context
                    .ServiceGroup
                    .Include(i => i.Services)
                    !.ThenInclude(i => i.PromoServices)
                    .ToListAsync(cancellationToken))
                    .Adapt<List<ServiceGroupDto>>();

                if(request.PromoId != null)
                {
                    var promo = await _context
                        .Promo
                        .Include(i => i.PromoServices)
                        .ThenInclude(i => i.Service)
                        .ThenInclude(i => i.Group)
                        .FirstOrDefaultAsync(i => i.Id == request.PromoId, cancellationToken)
                            ?? throw new Exception(ErrorMessages.PROMO_ERROR);

                    List<int> groupIds = [];
                    List<int> serviceIds = [];

                    foreach (var item in promo.PromoServices)
                    {
                        groupIds.Add(item.Service.GroupId);
                        serviceIds.Add(item.ServiceId);
                    }

                    items = items.Where(i => groupIds.Contains((int)i.Id!)).ToList();

                    var dtos = items
                        .Select(i =>
                        {
                            i.Services = i.Services?.Where(s => serviceIds.Contains((int)s.Id!)).ToList();

                            return i;
                        })
                        .ToList();

                    //return new PaginationResponse<ServiceGroupDto>(
                    //    dtos,
                    //    request.Page,
                    //    request.Size);
                }

                if(request.ServiceName != null)
                {
                    var dtos = items
                        .Select(i =>
                        {
                            i.Services = i.Services?.Where(s => s.Name.Contains(request.ServiceName)).ToList();

                            return i;
                        })
                        .Where(i => i.Services?.Count > 0)
                        .ToList();
                }

                return new PaginationResponse<ServiceGroupDto>(
                    items,
                    request.Page,
                    request.Size);
            }
        }
    }
}