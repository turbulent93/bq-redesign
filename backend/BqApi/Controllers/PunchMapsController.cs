using BeautyQueenApi.Requests.Pagination;
using BeautyQueenApi.Requests.Promos;
using BeautyQueenApi.Requests.PunchMaps;
using BeautyQueenApi.Requests.Services;
using BeautyQueenApi.Requests.Specializations;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BeautyQueenApi.Controllers
{
    [Route("api/punch-maps")]
    [ApiController]
    public class PunchMapsController(ISender mediator) : ControllerBase
    {
        private readonly ISender _mediator = mediator;

        [HttpPost("get")]
        public async Task<ActionResult<PaginationResponse<PunchMapDto>>> Get(GetPunchMapRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PunchMapDto>> View(int id)
        {
            return await _mediator.Send(new ViewPunchMapRequest { Id = id });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<PunchMapDto>> Update(int id, CreateOrUpdatePunchMapRequest request)
        {
            request.Id = id;
            return await _mediator.Send(request);
        }

        [HttpPost]
        public async Task<ActionResult<PunchMapDto>> Create(CreateOrUpdatePunchMapRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<PunchMapDto>> Remove(int id)
        {
            return await _mediator.Send(new RemovePunchMapRequest { Id = id });
        }
    }
}
