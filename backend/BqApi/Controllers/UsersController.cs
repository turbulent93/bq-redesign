using BeautyQueenApi.Requests.Pagination;
using BeautyQueenApi.Requests.Users;
using BqApi.Requests.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BeautyQueenApi.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController(ISender mediator) : ControllerBase
    {
        private readonly ISender _mediator = mediator;

        [HttpPost("get")]
        [AllowAnonymous]
        public async Task<ActionResult<PaginationResponse<UserDto>>> Get(GetUsersRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpPost("employees/get")]
        [AllowAnonymous]
        public async Task<ActionResult<PaginationResponse<EmployeeDto>>> GetEmployees(GetEmployeesRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> View(int id)
        {
            return await _mediator.Send(new ViewUserRequest { Id = id });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Update(int id, CreateOrUpdateUserRequest request)
        {
            request.Id = id;
            return await _mediator.Send(request);
        }

        [HttpPut("partial/{id}")]
        public async Task<ActionResult<UserDto>> PartialUpdate(int id, PartialUpdateUserRequest request)
        {
            request.Id = id;
            return await _mediator.Send(request);
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> Create(CreateOrUpdateUserRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<UserDto>> Remove(int id)
        {
            return await _mediator.Send(new RemoveUserRequest { Id = id });
        }

        [HttpDelete("employee/{id}")]
        public async Task<ActionResult<EmployeeDto>> RemoveEmployee(int id)
        {
            return await _mediator.Send(new RemoveEmployeeRequest { Id = id });
        }
    }
}
