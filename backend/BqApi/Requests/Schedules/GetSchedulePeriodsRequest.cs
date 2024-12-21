using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Pagination;
using BqApi.Requests.Schedules;
using BqApi.Services.ScheduleService;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Schedules
{
    public class GetSchedulePriodsRequest : IRequest<List<SchedulePeriodDto>> {
        public int ScheduleId { get; set; }
        public int? ExcludedId { get; set; }

        public class Handler(IScheduleService scheduleService)
                : IRequestHandler<GetSchedulePriodsRequest, List<SchedulePeriodDto>> {
            private readonly IScheduleService _scheduleService = scheduleService;

            public async Task<List<SchedulePeriodDto>> Handle(
                GetSchedulePriodsRequest request, CancellationToken cancellationToken
            ) {
                
                return await _scheduleService.GetAvailablePeriods(request.ScheduleId, request.ExcludedId);
            }
        }
    }
}