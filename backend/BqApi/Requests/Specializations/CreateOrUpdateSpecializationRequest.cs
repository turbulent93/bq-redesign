using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Specializations
{
    public class CreateOrUpdateSpecializationRequest : SpecializationDto, IRequest<SpecializationDto> {
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<CreateOrUpdateSpecializationRequest, SpecializationDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<SpecializationDto> Handle(
                CreateOrUpdateSpecializationRequest request, CancellationToken cancellationToken
            ) {
                Specialization? item;
                if(request.Id != null) {
                    item = await _context
                            .Specialization
                            .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                        ?? throw new Exception(ErrorMessages.SPECIALIZATION_ERROR);

                    item.Update(request);

                } else {
                    item = new(request.Name);

                    _context.Specialization.Add(item);
                }

                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<SpecializationDto>();
            }
        }
    }
}