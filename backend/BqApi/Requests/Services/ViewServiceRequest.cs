using BeautyQueenApi.Data;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Services
{
    public class ViewServiceRequest : IRequest<ServiceDto> {
        public int Id { get; set; }
        
        public class Handler(ApplicationDbContext context) : IRequestHandler<ViewServiceRequest, ServiceDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<ServiceDto> Handle(
                ViewServiceRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context.Service.FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                    ?? throw new Exception(ErrorMessages.SERVICE_ERROR);

                return item.Adapt<ServiceDto>();
            }
        }
    }
}