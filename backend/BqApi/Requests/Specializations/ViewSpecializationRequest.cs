using BeautyQueenApi.Data;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Specializations
{
    public class ViewSpecializationRequest : IRequest<SpecializationDto> {
        public int Id { get; set; }
        
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<ViewSpecializationRequest, SpecializationDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<SpecializationDto> Handle(
                ViewSpecializationRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context.Specialization.FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                    ?? throw new Exception(ErrorMessages.SPECIALIZATION_ERROR);

                return item.Adapt<SpecializationDto>();
            }
        }
    }
}