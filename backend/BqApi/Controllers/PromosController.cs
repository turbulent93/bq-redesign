using BeautyQueenApi.Requests.Pagination;
using BeautyQueenApi.Requests.Promos;
using BeautyQueenApi.Requests.Services;
using BeautyQueenApi.Requests.Specializations;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BeautyQueenApi.Controllers
{
    [Route("api/promos")]
    [ApiController]
    public class PromosController(ISender mediator) : ControllerBase
    {
        private readonly ISender _mediator = mediator;

        [HttpPost("get")]
        public async Task<ActionResult<PaginationResponse<PromoDto>>> Get(GetPromoRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PromoDto>> View(int id)
        {
            return await _mediator.Send(new ViewPromoRequest { Id = id });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<PromoDto>> Update(int id, CreateOrUpdatePromoRequest request)
        {
            request.Id = id;
            return await _mediator.Send(request);
        }

        [HttpPost]
        public async Task<ActionResult<PromoDto>> Create(CreateOrUpdatePromoRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<PromoDto>> Remove(int id)
        {
            return await _mediator.Send(new RemovePromoRequest { Id = id });
        }
    }
}
