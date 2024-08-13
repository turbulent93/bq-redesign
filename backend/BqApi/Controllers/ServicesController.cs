using BeautyQueenApi.Requests.Pagination;
using BeautyQueenApi.Requests.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BeautyQueenApi.Controllers
{
    [Route("api/services")]
    [ApiController]
    public class ServicesController(ISender mediator) : ControllerBase
    {
        private readonly ISender _mediator = mediator;

        [HttpPost("get")]
        [AllowAnonymous]
        public async Task<ActionResult<PaginationResponse<ServiceDto>>> Get(GetServiceRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceDto>> View(int id)
        {
            return await _mediator.Send(new ViewServiceRequest { Id = id });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceDto>> Update(int id, CreateOrUpdateServiceRequest request)
        {
            request.Id = id;
            return await _mediator.Send(request);
        }

        [HttpPost]
        public async Task<ActionResult<ServiceDto>> Create(CreateOrUpdateServiceRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceDto>> Remove(int id)
        {
            return await _mediator.Send(new RemoveServiceRequest { Id = id });
        }
    }
}
