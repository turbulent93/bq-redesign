using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Schedules
{
    public class ClearScheduleRequest : IRequest<ScheduleDto> {
        public int Id { get; set; }
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<ClearScheduleRequest, ScheduleDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<ScheduleDto> Handle(
                ClearScheduleRequest request, CancellationToken cancellationToken
            ) {
                var schedules = await _context.Schedule
                    .Where(schedule => schedule.EmployeeId == request.Id &&
                        schedule.Date > DateOnly.FromDateTime(DateTime.Now))
                    .ToListAsync(cancellationToken);
                var isAppointedExists = false;

                foreach (var schedule in schedules)
                {
                    var isAppointed = await _context
                        .Appointment
                        .AnyAsync(i => i.ScheduleId == schedule!.Id, cancellationToken);

                    if (isAppointed)
                    {
                        isAppointedExists = true;
                    }
                    else
                    {
                        _context.Schedule.Remove(schedule);
                    }
                }

                await _context.SaveChangesAsync(cancellationToken);

                if (isAppointedExists)
                {
                    throw new Exception(ErrorMessages.HAS_APPOINTMENT_ERROR);
                }

                return new ScheduleDto();
            }
        }
    }
}