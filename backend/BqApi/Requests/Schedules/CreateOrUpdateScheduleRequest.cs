using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Schedules
{
    public class CreateOrUpdateScheduleRequest : ScheduleDto, IRequest<ScheduleDto> {
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<CreateOrUpdateScheduleRequest, ScheduleDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<ScheduleDto> Handle(
                CreateOrUpdateScheduleRequest request, CancellationToken cancellationToken
            ) {
                Schedule? item;
                if (request.Id != null)
                {
                    item = await _context
                            .Schedule
                            .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                        ?? throw new Exception(ErrorMessages.MASTER_ERROR);

                    item.Update(request);
                } else
                {
                    item = new()
                    {
                        EmployeeId = request.EmployeeId,
                        Date = DateOnly.Parse(request.Date),
                        StartAt = TimeOnly.Parse(request.StartAt),
                        EndAt = TimeOnly.Parse(request.EndAt)
                    };

                    _context.Schedule.Add(item);
                }
                    
                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<ScheduleDto>();
            }
        }
    }
}