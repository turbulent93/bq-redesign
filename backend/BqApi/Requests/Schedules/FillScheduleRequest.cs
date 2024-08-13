using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Appointments;
using BqApi.Constants;
using BqApi.Requests.Schedules;
using BqApi.Services.ScheduleService;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Schedules
{
    public class FillScheduleRequest : FillScheduleDto, IRequest<List<int>> {
        public class Handler(IScheduleService scheduleService)
                : IRequestHandler<FillScheduleRequest, List<int>> {
            private readonly IScheduleService _scheduleService = scheduleService;

            public async Task<List<int>> Handle(
                FillScheduleRequest request, CancellationToken cancellationToken
            ) {
                return await _scheduleService.Fill(request);
            }
            
        }
    }
}