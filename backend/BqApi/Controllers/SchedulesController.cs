using BeautyQueenApi.Requests.Schedules;
using BqApi.Services.ScheduleService;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BeautyQueenApi.Controllers
{
    [Route("api/schedules")]
    [ApiController]
    public class SchedulesController(ISender mediator) : ControllerBase
    {
        private readonly ISender _mediator = mediator;

        [HttpPost("nearest")]
        [AllowAnonymous]
        public async Task<ActionResult<ScheduleDto?>> Nearest(GetNearestScheduleRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpPost("get")]
        [AllowAnonymous]
        public async Task<ActionResult<List<ScheduleDayDto>>> Get(GetSchedulesRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpPost("times/get")]
        [AllowAnonymous]
        public async Task<ActionResult<List<ScheduleTimeDto>>> GetTimes(GetScheduleTimesRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ScheduleDto>> View(int id)
        {
            return await _mediator.Send(new ViewScheduleRequest { Id = id });
        }

        [HttpPost("fill")]
        public async Task<ActionResult<List<int>>> Fill(FillScheduleRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpPost]
        public async Task<ActionResult<ScheduleDto>> Create(CreateOrUpdateScheduleRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ScheduleDto>> Update(int id, CreateOrUpdateScheduleRequest request)
        {
            request.Id = id;
            return await _mediator.Send(request);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ScheduleDto>> Remove(int id)
        {
            return await _mediator.Send(new RemoveScheduleRequest { Id = id });
        }

        [HttpDelete("clear")]
        public async Task<ActionResult<ScheduleDto>> Clear(int id)
        {
            return await _mediator.Send(new ClearScheduleRequest { Id = id });
        }
    }
}
