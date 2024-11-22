using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Pagination;
using BqApi.Requests.Users;
using BqApi.Services.ScheduleService;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Linq;

namespace BeautyQueenApi.Requests.Users
{
    public class GetEmployeesRequest : PaginationRequest, IRequest<PaginationResponse<EmployeeDto>> {
        public int? ServiceId { get; set; }
        public bool? WithUpcomingAppointments { get; set; }
        public int? ScheduleId { get; set; }
        public int? Duration { get; set; }

        public class Handler(ApplicationDbContext context, IScheduleService scheduleService) : IRequestHandler<GetEmployeesRequest, PaginationResponse<EmployeeDto>> {
            private readonly ApplicationDbContext _context = context;
            private readonly IScheduleService _scheduleService = scheduleService;
            public async Task<PaginationResponse<EmployeeDto>> Handle(
                GetEmployeesRequest request, CancellationToken cancellationToken
            ) {
                IQueryable<Employee> items = _context
                        .Employee
                        .Include(i => i!.Specializations)
                        .Include(i => i.File);

                if (request.ServiceId != null)
                {
                    items = items
                        .Where(i => i.Specializations.Any(s => s.Services.Any(a => a.Id == request.ServiceId)));
                }

                var responseItems = (await items.ToListAsync(cancellationToken)).Adapt<List<EmployeeDto>>();

                if (request.WithUpcomingAppointments == true && request.Duration != null)
                {
                    foreach (var item in responseItems)
                    {
                        var schedules = await _context
                            .Schedule
                            .Where(i => i.EmployeeId == item.Id
                                && i.Date.Day >= DateTime.Now.Day
                                && i.Date.Month >= DateTime.Now.Month
                                && i.Date.Year >= DateTime.Now.Year)
                            .ToListAsync(cancellationToken);


                        for (int i = 0; i < schedules.Count; i++)
                        {
                            var at = (await _scheduleService.GetAvailableTime(schedules[i].Id, (int)request.Duration))
                                .Where(i => i.IsAvailable)
                                .Select(std => {
                                    TimeOnly.TryParseExact(std.Time, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly time);

                                    return new UpcomigAppointment(
                                        schedules[i].Id,
                                        schedules[i].Date.ToString(),
                                        std.Time,
                                        time.AddMinutes((int)request.Duration).ToString());
                                })
                                .ToList();

                            if(at.Count > 0)
                            {
                                item.UpcomingAppointments = at;
                                break;
                            }
                        }
                    }

                    responseItems = responseItems
                        .Where(i => i.UpcomingAppointments.Count > 0)
                        .ToList();
                }

                return new PaginationResponse<EmployeeDto>(
                    responseItems,
                    request.Page,
                    request.Size
                );
            }
        }
    }
}