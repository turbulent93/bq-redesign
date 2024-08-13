using BeautyQueenApi.Requests.Pagination;
using BeautyQueenApi.Requests.Services;
using BeautyQueenApi.Requests.Specializations;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BeautyQueenApi.Controllers
{
    [Route("api/specialiations")]
    [ApiController]
    public class SpecialiaztionsController(ISender mediator) : ControllerBase
    {
        private readonly ISender _mediator = mediator;

        [HttpPost("get")]
        public async Task<ActionResult<PaginationResponse<SpecializationDto>>> Get(GetSpecializationRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SpecializationDto>> View(int id)
        {
            return await _mediator.Send(new ViewSpecializationRequest { Id = id });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SpecializationDto>> Update(int id, CreateOrUpdateSpecializationRequest request)
        {
            request.Id = id;
            return await _mediator.Send(request);
        }

        [HttpPost]
        public async Task<ActionResult<SpecializationDto>> Create(CreateOrUpdateSpecializationRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<SpecializationDto>> Remove(int id)
        {
            return await _mediator.Send(new RemoveSpecializationRequest { Id = id });
        }
    }
}
