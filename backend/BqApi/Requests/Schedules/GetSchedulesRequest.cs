using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Pagination;
using BeautyQueenApi.Services.TokenService;
using BqApi.Services.ScheduleService;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace BeautyQueenApi.Requests.Schedules
{
    public class ScheduleDayDto
    {
        public int? ScheduleId { get; set; }
        public string? StartAt { get; set; }
        public string? EndAt { get; set; }
        public int Day { get; set; }
        public bool IsCurrentMonth { get; set; }
        public string? Content { get; set; } = null!;
    }

    public class GetSchedulesRequest : IRequest<List<ScheduleDayDto>> {
        public int? EmployeeId { get; set; }
        public int? Year { get; set; }
        public int? Month { get; set; }
        public int? Duration { get; set; }
        public string ContentType { get; set; } = null!;
        public string? StartAt { get; set; }
        public string? EndAt { get; set; }
        public string? AllowedWeekdays { get; set; }

        public class Handler(ApplicationDbContext context, IScheduleService scheduleService)
                : IRequestHandler<GetSchedulesRequest, List<ScheduleDayDto>> {
            private readonly ApplicationDbContext _context = context;
            private readonly IScheduleService _scheduleService = scheduleService;

            public async Task<List<ScheduleDayDto>> Handle(
                GetSchedulesRequest request, CancellationToken cancellationToken
            ) {
                TimeOnly.TryParseExact(request.StartAt, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly startAt);
                TimeOnly.TryParseExact(request.EndAt, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly endAt);

                var days = new List<ScheduleDayDto>();

                var currentDate = new DateTime((int)request.Year!, (int)request.Month!, 1);

                var firstDayOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
                var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

                var weekdayOfFirstDay = (int)firstDayOfMonth.DayOfWeek == 0 ? 7 : (int)firstDayOfMonth.DayOfWeek;
                var weekdayOfLastDay = (int)lastDayOfMonth.DayOfWeek == 0 ? 7 : (int)lastDayOfMonth.DayOfWeek;

                var lastDayOfPreviousMonth = firstDayOfMonth.AddDays(-1);
                var startDay = lastDayOfPreviousMonth.Day - weekdayOfFirstDay + 2;
                var lastDay = 7 + 7 - weekdayOfLastDay;

                var curDate = new DateOnly(
                    currentDate.Year,
                    currentDate.Month - (weekdayOfFirstDay != 1 ? 1 : 0) == 0 ? 12 : currentDate.Month - (weekdayOfFirstDay != 1 ? 1 : 0),
                    weekdayOfFirstDay != 1 ? startDay : 1
                );

                if (weekdayOfFirstDay != 1)
                {
                    for (int i = startDay; i <= lastDayOfPreviousMonth.Day; i++)
                    {
                        var item = await _context
                            .Schedule
                            .FirstOrDefaultAsync(i => i.Date.Year == curDate.Year
                                && i.Date.Month == curDate.Month
                                && i.Date.Day == curDate.Day
                                && (request.ContentType != "SLOTS" || i.Date.Day >= DateTime.Now.Day)
                                && (request.EmployeeId == null || i.EmployeeId == request.EmployeeId), cancellationToken);

                        //int count = 0;

                        //if (request.Duration != null && item != null)
                        //{
                        //    count = await _scheduleService.GetAvailableTimeCount(item.Id, (int)request.Duration);
                        //}

                        days.Add(new ScheduleDayDto
                        {
                            Day = i,
                            IsCurrentMonth = false,
                            ScheduleId = item?.Id,
                            StartAt = item?.StartAt.ToString(),
                            EndAt = item?.EndAt.ToString(),
                            Content = await _scheduleService.GetContent(
                                request.ContentType,
                                item?.Id,
                                request.Duration,
                                request.StartAt != null ? startAt : null,
                                request.EndAt != null ? endAt : null)
                        });
                        curDate = curDate.AddDays(1);
                    }
                }

                for (int i = 1; i <= lastDayOfMonth.Day; i++)
                {
                    var item = await _context
                            .Schedule
                            .FirstOrDefaultAsync(i => i.Date.Year == curDate.Year
                                && i.Date.Month == curDate.Month
                                && i.Date.Day == curDate.Day
                                && (request.ContentType != "SLOTS" || i.Date.Day >= DateTime.Now.Day)
                                && (request.EmployeeId == null || i.EmployeeId == request.EmployeeId), cancellationToken);

                    //var count = 0;

                    //if (request.Duration != null && item != null)
                    //{
                    //    count = await _scheduleService.GetAvailableTimeCount(item.Id, (int)request.Duration);
                    //}

                    days.Add(new ScheduleDayDto
                    {
                        Day = i,
                        IsCurrentMonth = true,
                        ScheduleId = item?.Id,
                        StartAt = item?.StartAt.ToString(),
                        EndAt = item?.EndAt.ToString(),
                        Content = await _scheduleService.GetContent(
                                request.ContentType,
                                item?.Id,
                                request.Duration,
                                request.StartAt != null ? startAt : null,
                                request.EndAt != null ? endAt : null)
                    });
                    curDate = curDate.AddDays(1);
                }

                for (int i = 1; i <= lastDay; i++)
                {
                    var item = await _context
                            .Schedule
                            .FirstOrDefaultAsync(i => i.Date.Year == curDate.Year
                                && i.Date.Month == curDate.Month
                                && i.Date.Day == curDate.Day
                                && (request.ContentType != "SLOTS" || i.Date.Day >= DateTime.Now.Day)
                                && (request.EmployeeId == null || i.EmployeeId == request.EmployeeId), cancellationToken);

                    //int count = 0;

                    //if (request.Duration != null && item != null)
                    //{
                    //    count = await _scheduleService.GetAvailableTimeCount(item.Id, (int)request.Duration);
                    //}

                    days.Add(new ScheduleDayDto
                    {
                        Day = i,
                        IsCurrentMonth = false,
                        ScheduleId = item?.Id,
                        StartAt = item?.StartAt.ToString(),
                        EndAt = item?.EndAt.ToString(),
                        Content = await _scheduleService.GetContent(
                                request.ContentType,
                                item?.Id,
                                request.Duration,
                                request.StartAt != null ? startAt : null,
                                request.EndAt != null ? endAt : null)
                    });
                    curDate = curDate.AddDays(1);
                }

                return days;
            }
        }
    }
}