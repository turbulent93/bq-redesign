using BeautyQueenApi.Data;
using BqApi.Requests.Statistic;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Runtime.CompilerServices;

namespace BqApi.Services.StatisticService
{
    public class StatisticService(ApplicationDbContext context) : IStatisticService
    {
        private readonly ApplicationDbContext _context = context;

        private async Task<StatisticDto> GetRevenueStatistic(StatisticRequest request)
        {
            var apps = await _context.Appointment
                .Include(x => x.Schedule)
                .Include(x => x.Service)
                .ToListAsync();

            if (request.EmployeeId != null)
            {
                apps = apps.Where(x => x.EmployeeId == request.EmployeeId).ToList();
            }

            if(request.StartDate == null || request.EndDate == null)
            {
                var curDate = DateTime.Now;
                apps = apps
                    .Where(i => i.Schedule.Date.Year == curDate.Year && i.Schedule.Date.Month == curDate.Month)
                    .ToList();
            }

            if (request.StartDate != null)
            {
                DateOnly.TryParseExact(request.StartDate, "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly startDate);

                var date = startDate;
                apps = apps.Where(x => x.Schedule.Date >= date).ToList();
            }

            if (request.EndDate != null)
            {
                DateOnly.TryParseExact(request.EndDate, "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly endDate);

                apps = apps.Where(x => x.Schedule.Date <= endDate).ToList();
            }

            var statistics = apps
                .GroupBy(x => x.ScheduleId)
                .Select(x => new
                {
                    Label = x.Select(a => a.Schedule.Date.Day).First(),
                    Value = x.Select(a => a.Service.Price).Sum()
                })
                .OrderBy(x => x.Label);

            return new StatisticDto
            {
                Labels = statistics.Select(x => x.Label.ToString()).ToList(),
                Values = statistics.Select(x => x.Value).ToList()
            };
        }

        private async Task<StatisticDto> GetAppointmentStatistic(StatisticRequest request)
        {
            var apps = await _context.Appointment
                .Include(x => x.Schedule)
                .ToListAsync();

            if (request.EmployeeId != null)
            {
                apps = apps.Where(x => x.EmployeeId == request.EmployeeId).ToList();
            }

            if (request.StartDate == null || request.EndDate == null)
            {
                var curDate = DateTime.Now;
                apps = apps
                    .Where(i => i.Schedule.Date.Year == curDate.Year && i.Schedule.Date.Month == curDate.Month)
                    .ToList();
            }

            if (request.StartDate != null)
            {
                DateOnly.TryParseExact(request.StartDate, "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly startDate);

                var date = startDate;
                apps = apps.Where(x => x.Schedule.Date >= date).ToList();
            }

            if (request.EndDate != null)
            {
                DateOnly.TryParseExact(request.EndDate, "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly endDate);

                apps = apps.Where(x => x.Schedule.Date <= endDate).ToList();
            }

            var statistics = apps
                .GroupBy(x => x.ScheduleId)
                .Select(x => new
                {
                    Label = x.Select(a => a.Schedule.Date.Day).First(),
                    Value = x.Select(a => a).Count()
                })
                .OrderBy(x => x.Label);

            return new StatisticDto
            {
                Labels = statistics.Select(x => x.Label.ToString()).ToList(),
                Values = statistics.Select(x => x.Value).ToList()
            };
        }

        private async Task<StatisticDto> GetServiceStatistic(StatisticRequest request)
        {
            var apps = await _context.Appointment
                .Include(x => x.Schedule)
            .ToListAsync();

            if (request.EmployeeId != null)
            {
                apps = apps.Where(x => x.EmployeeId == request.EmployeeId).ToList();
            }

            if (request.StartDate == null || request.EndDate == null)
            {
                var curDate = DateTime.Now;
                apps = apps
                    .Where(i => i.Schedule.Date.Year == curDate.Year && i.Schedule.Date.Month == curDate.Month)
                    .ToList();
            }

            if (request.StartDate != null)
            {
                DateOnly.TryParseExact(request.StartDate, "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly startDate);

                var date = startDate;
                apps = apps.Where(x => x.Schedule.Date >= date).ToList();
            }

            if (request.EndDate != null)
            {
                DateOnly.TryParseExact(request.EndDate, "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly endDate);

                apps = apps.Where(x => x.Schedule.Date <= endDate).ToList();
            }

            var statistics = apps
                .GroupBy(x => x.ServiceId)
                .Select(x => new
                {
                    Label = x.Select(a => a.Service.Name).First(),
                    Value = x.Select(a => a).Count()
                })
                .OrderBy(x => x.Label);

            return new StatisticDto
            {
                Labels = statistics.Select(x => x.Label).ToList(),
                Values = statistics.Select(x => x.Value).ToList()
            };
        }

        private async Task<int> GetRevenueCount(StatisticRequest request)
        {
            var apps = await _context.Appointment
                .Include(x => x.Schedule)
                .Include(i => i.Service)
                .ToListAsync();

            if (request.EmployeeId != null)
            {
                apps = apps.Where(x => x.EmployeeId == request.EmployeeId).ToList();
            }

            if (request.StartDate == null || request.EndDate == null)
            {
                var curDate = DateTime.Now;
                apps = apps
                    .Where(i => i.Schedule.Date.Year == curDate.Year && i.Schedule.Date.Month == curDate.Month)
                    .ToList();
            }

            if (request.StartDate != null)
            {
                DateOnly.TryParseExact(request.StartDate, "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly startDate);

                var date = startDate;
                apps = apps.Where(x => x.Schedule.Date >= date).ToList();
            }

            if (request.EndDate != null)
            {
                DateOnly.TryParseExact(request.EndDate, "dd.MM.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly endDate);

                apps = apps.Where(x => x.Schedule.Date <= endDate).ToList();
            }

            return apps.Sum(i => i.Service.Price);
        }

        public async Task<ResponseStatisticDto> Get(StatisticRequest request)
        {
            return new ResponseStatisticDto
            {
                RevenueCount = await GetRevenueCount(request),
                Revenue = await GetRevenueStatistic(request),
                Applications = await GetAppointmentStatistic(request),
                Services = await GetServiceStatistic(request)
            };
        }

        public async Task<ResponseProfileStatisticDto> GetProfile(RequestProfileStatisticDto request)
        {
            var now = DateTime.Now;

            var schedulesCount = await _context.Schedule.CountAsync(i => i.EmployeeId == request.EmployeeId
                && i.Date.Day < now.Day);

            var appointmentsCount = await _context
                .Appointment
                .Include(i => i.Schedule)
                .CountAsync(i => i.EmployeeId == request.EmployeeId
                && i.Schedule.Date.Day > now.Day);

            var totalCount = await _context
                .Appointment
                .Include(i => i.Schedule)
                .Include(i => i.Service)
                .Where(i => i.EmployeeId == request.EmployeeId && i.Schedule.Date.Day > now.Day)
                .SumAsync(i => i.Service.Price);

            return new ResponseProfileStatisticDto
            {
                SchedulesCount = schedulesCount,
                AppointmentsCount = appointmentsCount,
                TotalAmount = totalCount
            };
        }
    }
}