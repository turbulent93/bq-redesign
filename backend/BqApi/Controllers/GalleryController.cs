using BeautyQueenApi.Requests.GalleryItem;
using BeautyQueenApi.Requests.Pagination;
using BeautyQueenApi.Requests.Promos;
using BeautyQueenApi.Requests.Services;
using BeautyQueenApi.Requests.Specializations;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BeautyQueenApi.Controllers
{
    [Route("api/gallery")]
    [ApiController]
    public class GalleryController(ISender mediator) : ControllerBase
    {
        private readonly ISender _mediator = mediator;

        [HttpPost("get")]
        public async Task<ActionResult<PaginationResponse<GalleryDto>>> Get(GetGalleryRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GalleryDto>> View(int id)
        {
            return await _mediator.Send(new ViewGalleryRequest { Id = id });
        }

        //[HttpPut("{id}")]
        //public async Task<ActionResult<List<GalleryDto>>> Update(int id, CreateOrUpdateGalleryRequest request)
        [HttpPut]
        public async Task<ActionResult<List<GalleryDto>>> Update(CreateOrUpdateGalleryRequest request)
        {
            //request.Id = id;
            return await _mediator.Send(request);
        }

        [HttpPost]
        public async Task<ActionResult<List<GalleryDto>>> Create(CreateOrUpdateGalleryRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<GalleryDto>> Remove(int id)
        {
            return await _mediator.Send(new RemoveGalleryRequest { Id = id });
        }
    }
}
