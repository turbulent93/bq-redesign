using BeautyQueenApi.Data;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Schedules
{
    public class ViewScheduleRequest : IRequest<ScheduleDto> {
        public int Id { get; set; }
        
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<ViewScheduleRequest, ScheduleDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<ScheduleDto> Handle(
                ViewScheduleRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context
                    .Schedule
                    .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                        ?? throw new Exception(ErrorMessages.SCHEDULE_ERROR);

                return item.Adapt<ScheduleDto>();
            }
        }
    }
}