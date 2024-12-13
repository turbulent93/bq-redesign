using BeautyQueenApi.Data;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Schedules
{
    public class GetNearestScheduleRequest : IRequest<ScheduleDto?> {
        public int EmployeeId { get; set; }
        
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<GetNearestScheduleRequest, ScheduleDto?> {
            private readonly ApplicationDbContext _context = context;

            public async Task<ScheduleDto?> Handle(
                GetNearestScheduleRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context
                    .Schedule
                    .OrderBy(i => i.Date)
                    .FirstOrDefaultAsync(i => i.EmployeeId == request.EmployeeId, cancellationToken);

                return item.Adapt<ScheduleDto>();
            }
        }
    }
}