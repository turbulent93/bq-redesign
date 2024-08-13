using BeautyQueenApi.Data;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Schedules
{
    public class RemoveScheduleRequest : IRequest<ScheduleDto> {
        public int Id { get; set; }
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<RemoveScheduleRequest, ScheduleDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<ScheduleDto> Handle(
                RemoveScheduleRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context
                        .Schedule
                        .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                    ?? throw new Exception(ErrorMessages.SCHEDULE_ERROR);

                _context.Schedule.Remove(item);
                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<ScheduleDto>();
            }
        }
    }
}