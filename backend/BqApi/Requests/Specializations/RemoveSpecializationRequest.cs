using BeautyQueenApi.Data;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Specializations
{
    public class RemoveSpecializationRequest : IRequest<SpecializationDto> {
        public int Id { get; set; }
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<RemoveSpecializationRequest, SpecializationDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<SpecializationDto> Handle(
                RemoveSpecializationRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context
                        .Specialization
                        .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                    ?? throw new Exception(ErrorMessages.SPECIALIZATION_ERROR);

                _context.Specialization.Remove(item);
                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<SpecializationDto>();
            }
        }
    }
}