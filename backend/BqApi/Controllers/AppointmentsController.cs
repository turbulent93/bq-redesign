using BeautyQueenApi.Requests.Appointments;
using BeautyQueenApi.Requests.Pagination;
using BeautyQueenApi.Requests.Services;
using BeautyQueenApi.Requests.Specializations;
using BqApi.TgBot;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Parlot.Fluent;
using Telegram.Bot;
using Telegram.Bot.Types;

namespace BeautyQueenApi.Controllers
{
    [Route("api/appointments")]
    [ApiController]
    public class AppointmentsController(ISender mediator) : ControllerBase
    {
        private readonly ISender _mediator = mediator;

        [HttpPost("get")]
        [AllowAnonymous]
        public async Task<ActionResult<PaginationResponse<AppointmentDto>>> Get(GetAppointmentRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentDto>> View(int id)
        {
            return await _mediator.Send(new ViewAppointmentRequest { Id = id });
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<AppointmentDto>> Create(CreateOrUpdateAppointmentRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AppointmentDto>> Update(int id, CreateOrUpdateAppointmentRequest request)
        {
            request.Id = id;
            return await _mediator.Send(request);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<AppointmentDto>> Remove(int id)
        {
            return await _mediator.Send(new RemoveAppointmentRequest { Id = id });
        }
    }
}
