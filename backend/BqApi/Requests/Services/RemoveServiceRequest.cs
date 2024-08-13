using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Services
{
    public class RemoveServiceRequest : IRequest<ServiceDto> {
        public int Id { get; set; }
        public class Handler(ApplicationDbContext context) : IRequestHandler<RemoveServiceRequest, ServiceDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<ServiceDto> Handle(
                RemoveServiceRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context.Service.FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                    ?? throw new Exception(ErrorMessages.SERVICE_ERROR);

                _context.Service.Remove(item);
                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<ServiceDto>();
            }
        }
    }
}