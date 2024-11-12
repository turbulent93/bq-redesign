using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.ServiceGroups
{
    public class RemoveServiceGroupRequest : IRequest<ServiceGroupDto> {
        public int Id { get; set; }
        public class Handler(ApplicationDbContext context) : IRequestHandler<RemoveServiceGroupRequest, ServiceGroupDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<ServiceGroupDto> Handle(
                RemoveServiceGroupRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context.ServiceGroup.FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                    ?? throw new Exception(ErrorMessages.SERVICE_ERROR);

                _context.ServiceGroup.Remove(item);
                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<ServiceGroupDto>();
            }
        }
    }
}