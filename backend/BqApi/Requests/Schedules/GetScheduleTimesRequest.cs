using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Pagination;
using BqApi.Services.ScheduleService;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace BeautyQueenApi.Requests.Schedules
{
    public class GetScheduleTimesRequest : IRequest<List<ScheduleTimeDto>> {
        public int ScheduleId { get; set; }
        public int Duration { get; set; }
        public string? StartAt { get; set; }
        public string? EndAt { get; set; }

        public class Handler(IScheduleService scheduleService)
                : IRequestHandler<GetScheduleTimesRequest, List<ScheduleTimeDto>> {
            private readonly IScheduleService _scheduleService = scheduleService;

            public async Task<List<ScheduleTimeDto>> Handle(
                GetScheduleTimesRequest request, CancellationToken cancellationToken
            ) {
                TimeOnly.TryParseExact(request.StartAt, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly startAt);
                TimeOnly.TryParseExact(request.EndAt, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly endAt);

                return await _scheduleService.GetAvailableTime(
                    request.ScheduleId,
                    request.Duration,
                    request.StartAt != null ? startAt : null,
                    request.EndAt != null ? endAt : null);
            }
        }
    }
}