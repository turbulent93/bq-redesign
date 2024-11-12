using BeautyQueenApi.Data;
using BeautyQueenApi.Requests.Pagination;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.ServiceGroups
{
    public class GetServiceGroupRequest : PaginationRequest, IRequest<PaginationResponse<ServiceGroupDto>> {
        public int? EmployeeId { get; set; }
        public int[]? ExludedIds { get; set; }

        public class Handler(ApplicationDbContext context
        ) : IRequestHandler<GetServiceGroupRequest, PaginationResponse<ServiceGroupDto>> {
            private readonly ApplicationDbContext _context = context;

            public async Task<PaginationResponse<ServiceGroupDto>> Handle(
                GetServiceGroupRequest request, CancellationToken cancellationToken
            ) {
                var items = await _context
                    .ServiceGroup
                    .Include(i => i.Services)
                    .ToListAsync(cancellationToken);

                return new PaginationResponse<ServiceGroupDto>(
                    items.Adapt<List<ServiceGroupDto>>(),
                    request.Page,
                    request.Size);
            }
        }
    }
}