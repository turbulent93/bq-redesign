using BeautyQueenApi.Data;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.ServiceGroups
{
    public class ViewServiceGroupRequest : IRequest<ServiceGroupDto> {
        public int Id { get; set; }
        
        public class Handler(ApplicationDbContext context) : IRequestHandler<ViewServiceGroupRequest, ServiceGroupDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<ServiceGroupDto> Handle(
                ViewServiceGroupRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context.ServiceGroup.FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                    ?? throw new Exception(ErrorMessages.SERVICE_ERROR);

                return item.Adapt<ServiceGroupDto>();
            }
        }
    }
}