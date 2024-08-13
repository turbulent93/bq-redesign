using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Pagination;
using BqApi.Services.ScheduleService;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Schedules
{
    public class ScheduleTimeDto
    {
        public string Time { get; set; } = null!;
        public bool IsAvailable { get; set; }
    }

    public class GetScheduleTimesRequest : IRequest<List<ScheduleTimeDto>> {
        public int ScheduleId { get; set; }
        public int Duration { get; set; }

        public class Handler(IScheduleService scheduleService)
                : IRequestHandler<GetScheduleTimesRequest, List<ScheduleTimeDto>> {
            private readonly IScheduleService _scheduleService = scheduleService;

            public async Task<List<ScheduleTimeDto>> Handle(
                GetScheduleTimesRequest request, CancellationToken cancellationToken
            ) {
                
                return await _scheduleService.GetAvailableTime(request.ScheduleId, request.Duration);
            }
        }
    }
}