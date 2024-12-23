using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Pagination;
using BqApi.Requests.Users;
using BqApi.Services.ScheduleService;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace BeautyQueenApi.Requests.Users
{
    public class GetUsersRequest : PaginationRequest, IRequest<PaginationResponse<UserDto>> {
        public List<string>? Roles { get; set; } = null!;
        public bool? WithUpcomingAppointments { get; set; }
        public int? Duration { get; set; }
        public int? ServiceId { get; set; }
        public int? PromoId { get; set; }

        public class Handler(ApplicationDbContext context, IScheduleService scheduleService) : IRequestHandler<GetUsersRequest, PaginationResponse<UserDto>> {
            private readonly ApplicationDbContext _context = context;
            private readonly IScheduleService _scheduleService = scheduleService;

            public async Task<PaginationResponse<UserDto>> Handle(
                GetUsersRequest request, CancellationToken cancellationToken
            ) {
                IQueryable<User> items = _context
                        .User
                        .Include(i => i.Specializations)
                        .Include(i => i.Avatar)
                        .Include(i => i.Promos)
                        .Include(i => i.PunchMap)
                        .Include(i => i.ClientAppointments);

                Promo? promo = null;

                if(request.PromoId != null)
                {
                    promo = await _context.Promo.FirstOrDefaultAsync(i => i.Id == request.PromoId, cancellationToken);
                }

                if (request.Roles != null && request.Roles.Count > 0)
                {
                    items = items.Where(i => request.Roles.Contains(i.Role));
                }

                if (request.ServiceId != null)
                {
                    items = items
                        .Where(i => i.Specializations.Any(s => s.Services.Any(a => a.Id == request.ServiceId)));
                }

                if (request.WithUpcomingAppointments == true && request.Duration != null)
                {
                    var responseItems = (await items.ToListAsync(cancellationToken)).Adapt<List<UserDto>>();
                    var dateNow = DateOnly.FromDateTime(DateTime.Now);
                    var timeNow = TimeOnly.FromDateTime(DateTime.Now);

                    timeNow = timeNow.AddMinutes(10 - (timeNow.Minute % 10));

                    foreach (var item in responseItems)
                    {
                        var schedules = await _context
                            .Schedule
                            .Where(i => i.EmployeeId == item.Id
                                && i.Date.Day >= DateTime.Now.Day
                                && i.Date.Month >= DateTime.Now.Month
                                && i.Date.Year >= DateTime.Now.Year
                                && (promo == null || promo.AllowedWeekDays!.Contains(i.Date.DayOfWeek == 0 ? "7" : i.Date.DayOfWeek.ToString())))
                            .ToListAsync(cancellationToken);


                        for (int i = 0; i < schedules.Count; i++)
                        {
                            TimeOnly? startTime = schedules[i].Date.Equals(dateNow) ? timeNow : null;

                            var at = (await _scheduleService.GetAvailableTime(
                                    schedules[i].Id,
                                    (int)request.Duration,
                                    (promo == null || startTime > promo.StartAt) ? startTime : promo.StartAt,
                                    promo?.EndAt))
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

                            if (at.Count > 0)
                            {
                                item.UpcomingAppointments = at;
                                break;
                            }
                        }
                    }

                    responseItems = responseItems
                        .Where(i => i.UpcomingAppointments.Count > 0)
                        .ToList();

                    return new PaginationResponse<UserDto>(responseItems, null, null);
                } else
                {
                    return new PaginationResponse<UserDto>(
                        (await items.ToListAsync(cancellationToken)).Adapt<List<UserDto>>(),
                        request.Page,
                        request.Size
                    );
                }
            }
        }
    }
}