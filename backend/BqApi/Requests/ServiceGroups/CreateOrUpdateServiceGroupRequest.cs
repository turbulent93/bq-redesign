using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.ServiceGroups
{
    public class CreateOrUpdateServiceGroupRequest : ServiceGroupDto, IRequest<ServiceGroupDto> {
        public class Handler(ApplicationDbContext context) : IRequestHandler<CreateOrUpdateServiceGroupRequest, ServiceGroupDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<ServiceGroupDto> Handle(
                CreateOrUpdateServiceGroupRequest request, CancellationToken cancellationToken
            ) {
                ServiceGroup? item;
                if(request.Id != null) {
                    item = await _context
                        .ServiceGroup
                        .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                            ?? throw new Exception(ErrorMessages.SERVICE_ERROR);

                    item.Update(request);

                } else {
                    item = new(request.Name);

                    _context.ServiceGroup.Add(item);
                }

                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<ServiceGroupDto>();
            }
        }
    }
}