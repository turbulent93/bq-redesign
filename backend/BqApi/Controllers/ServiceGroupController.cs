using BeautyQueenApi.Requests.Pagination;
using BeautyQueenApi.Requests.ServiceGroups;
using BeautyQueenApi.Requests.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BeautyQueenApi.Controllers
{
    [Route("api/service-groups")]
    [ApiController]
    public class ServiceGroupController(ISender mediator) : ControllerBase
    {
        private readonly ISender _mediator = mediator;

        [HttpPost("get")]
        [AllowAnonymous]
        public async Task<ActionResult<PaginationResponse<ServiceGroupDto>>> Get(GetServiceGroupRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceGroupDto>> View(int id)
        {
            return await _mediator.Send(new ViewServiceGroupRequest { Id = id });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceGroupDto>> Update(int id, CreateOrUpdateServiceGroupRequest request)
        {
            request.Id = id;
            return await _mediator.Send(request);
        }

        [HttpPost]
        public async Task<ActionResult<ServiceGroupDto>> Create(CreateOrUpdateServiceGroupRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceGroupDto>> Remove(int id)
        {
            return await _mediator.Send(new RemoveServiceGroupRequest { Id = id });
        }
    }
}
