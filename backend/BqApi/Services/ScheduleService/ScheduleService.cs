using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Appointments;
using BeautyQueenApi.Requests.Schedules;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Parlot.Fluent;
using System.Globalization;

namespace BqApi.Services.ScheduleService
{
    public class ScheduleService(ApplicationDbContext context) : IScheduleService
    {
        private readonly ApplicationDbContext _context = context;

        public async Task<List<int>> Fill(FillScheduleRequest request)
        {
            var workDaysCount = 1;
            var weekendDaysCount = 0;
            var isWorkDay = true;

            DateOnly.TryParseExact(request.StartDate, "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly startDate);
            DateOnly.TryParseExact(request.EndDate, "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly endDate);

            List<int> items = [];

            for (int i = startDate.Day; i <= endDate.Day; i++)
            {
                var curDate = new DateOnly(startDate.Year, startDate.Month, i);
                var curSchedule = _context
                    .Schedule
                    .FirstOrDefault(x => x.EmployeeId == request.EmployeeId && x.Date == curDate);

                if (request.FillType == "ONLY_WORK_DAYS" || isWorkDay == true)
                {
                    if (curSchedule == null)
                    {
                        TimeOnly.TryParseExact(request.StartAt, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly startAt);
                        TimeOnly.TryParseExact(request.EndAt, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly endAt);

                        _context.Schedule.Add(new Schedule
                        {
                            EmployeeId = request.EmployeeId,
                            Date = curDate,
                            StartAt = startAt,
                            EndAt = endAt
                        });
                    }
                    if (workDaysCount == request.WorkDays && request.FillType != "ONLY_WORK_DAYS")
                    {
                        workDaysCount = 0;
                        weekendDaysCount = 1;
                        isWorkDay = false;
                    }
                    else
                    {
                        workDaysCount++;
                    }
                }
                else if(request.FillType == "ONLY_WEEKEND_DAYS" || isWorkDay == false)
                {
                    if (curSchedule != null)
                    {
                        var appointment = await _context
                            .Appointment
                            .FirstOrDefaultAsync(i => i.ScheduleId == curSchedule!.Id);

                        if (appointment != null)
                        {
                            if(request.RemoveApplications)
                            {
                                _context.Schedule.Remove(curSchedule);
                            } else
                            {
                                items.Add(curSchedule.Id);
                            }
                        }
                    }
                    if (weekendDaysCount == request.WeekendDays && request.FillType != "ONLY_WEEKEND_DAYS")
                    {
                        weekendDaysCount = 0;
                        workDaysCount = 1;
                        isWorkDay = true;
                    }
                    else
                    {
                        weekendDaysCount++;
                    }
                }
            }

            await _context.SaveChangesAsync();

            return items;
        }

        public async Task<List<ScheduleTimeDto>> GetAvailableTime(int scheduleId, int duration, TimeOnly? startAt = null, TimeOnly? endAt = null)
        {
            var schedule = await _context
                    .Schedule
                    .FirstOrDefaultAsync((i) => i.Id == scheduleId)
                        ?? throw new Exception(ErrorMessages.SCHEDULE_ERROR);

            const int Between = 10;

            var items = new List<ScheduleTimeDto>();

            var curTime = startAt ?? schedule.StartAt;
            var endTime = endAt ?? schedule.EndAt;

            for (; curTime.Hour * 60 + curTime.Minute < endTime.Hour * 60 + endTime.Minute;)
            {
                var startMinutes = curTime.Hour * 60 + curTime.Minute;
                var endMinutes = startMinutes + duration + Between;

                var item = await _context
                    .Appointment
                    .OrderBy(i => i.StartAt)
                    .FirstOrDefaultAsync((i) => i.ScheduleId == scheduleId
                        && ((startMinutes >= i.StartAt.Hour * 60 + i.StartAt.Minute
                        && startMinutes < i.EndAt.Hour * 60 + i.EndAt.Minute)
                        || (endMinutes > i.StartAt.Hour * 60 + i.StartAt.Minute
                        && endMinutes <= i.EndAt.Hour * 60 + i.EndAt.Minute)));

                if (item == null)
                {
                    var timeToAdd = curTime;
                    curTime = curTime.AddMinutes(duration + Between);

                    items.Add(new ScheduleTimeDto
                    {
                        Time = timeToAdd.ToString(),
                        IsAvailable = item == null && curTime.Hour * 60 + curTime.Minute <= endTime.Hour * 60 + endTime.Minute
                    });
                }
                else
                {
                    var timeToAdd = curTime;
                    curTime = item.EndAt.AddMinutes(Between);

                    items.Add(new ScheduleTimeDto
                    {
                        Time = timeToAdd.ToString(),
                        IsAvailable = false // curTime.Hour * 60 + curTime.Minute <= endTime.Hour * 60 + endTime.Minute
                    });
                }
            }

            return items;
        }

        private async Task<string?> GetAvailableTimeCount(int scheduleId, int duration)
        {
            var count = (await GetAvailableTime(scheduleId, duration)).Count(i => i.IsAvailable);

            if (count > 0)
            {
                if (count == 1)
                {
                    return $"{count} место";
                }
                else if (count < 5)
                {
                    return $"{count} места";
                }
                else
                {
                    return $"{count} мест";
                }
            }

            return count > 0 ? count.ToString() : null;
        }

        private async Task<string?> GetAppointmentsCount(int scheduleId)
        {

            var schedule = await _context
                    .Schedule
                    .Include(i => i.Appointments)
                    .FirstOrDefaultAsync((i) => i.Id == scheduleId)
                        ?? throw new Exception(ErrorMessages.SCHEDULE_ERROR);

            var count = schedule.Appointments!.Count;

            if(count > 0)
            {
                if (count == 1)
                {
                    return $"{count} запись";
                }
                else if (count < 5)
                {
                    return $"{count} записи";
                }
                else
                {
                    return $"{count} записей";
                }
            }

            return null;
        }

        private async Task<string> GetWorkTime(int scheduleId)
        {

            var schedule = await _context
                    .Schedule
                    .Include(i => i.Appointments)
                    .FirstOrDefaultAsync((i) => i.Id == scheduleId)
                        ?? throw new Exception(ErrorMessages.SCHEDULE_ERROR);

            return $"{schedule.StartAt.Hour} - {schedule.EndAt.Hour}";
        }

        public async Task<string?> GetContent(string contentType, int? scheduleId, int? duration)
        {
            if (scheduleId == null) return null;

            if(contentType == "SLOTS" && duration != null)
            {
                return await GetAvailableTimeCount((int)scheduleId, (int)duration);
            } else if(contentType == "COUNT")
            {
                return await GetAppointmentsCount((int)scheduleId);
            } else if(contentType == "WORK_TIME")
            {
                return await GetWorkTime((int)scheduleId);
            }

            return null;
        }
    }
}
