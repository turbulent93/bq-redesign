using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

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
                    DateOnly.TryParseExact(request.Date, "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly date);
                    TimeOnly.TryParseExact(request.StartAt, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly startAt);
                    TimeOnly.TryParseExact(request.EndAt, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly endAt);

                    item = new()
                    {
                        EmployeeId = request.EmployeeId,
                        Date = date,
                        StartAt = startAt,
                        EndAt = endAt
                    };

                    _context.Schedule.Add(item);
                }
                    
                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<ScheduleDto>();
            }
        }
    }
}