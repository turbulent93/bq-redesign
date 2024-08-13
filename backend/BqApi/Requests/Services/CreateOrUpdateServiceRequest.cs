using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Services
{
    public class CreateOrUpdateServiceRequest : ServiceDto, IRequest<ServiceDto> {
        public class Handler(ApplicationDbContext context) : IRequestHandler<CreateOrUpdateServiceRequest, ServiceDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<ServiceDto> Handle(
                CreateOrUpdateServiceRequest request, CancellationToken cancellationToken
            ) {
                Service? item;
                if(request.Id != null) {
                    item = await _context
                        .Service
                        .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                        ?? throw new Exception(ErrorMessages.SERVICE_ERROR);

                    item.Update(request);

                } else {
                    item = new(request.Name, request.Price, request.Duration, request.SpecializationId);

                    _context.Service.Add(item);
                }

                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<ServiceDto>();
            }
        }
    }
}