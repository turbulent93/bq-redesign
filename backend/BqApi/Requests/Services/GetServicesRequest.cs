using BeautyQueenApi.Constants;
using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Pagination;
using BeautyQueenApi.Services.TokenService;
using BqApi.Services.TokenService;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BeautyQueenApi.Requests.Services
{
    public class GetServiceRequest : PaginationRequest, IRequest<PaginationResponse<ServiceDto>> {
        public int? EmployeeId { get; set; }

        public class Handler(ApplicationDbContext context
            //IHttpContextAccessor accessor,
            //ITokenService tokenService
        ) : IRequestHandler<GetServiceRequest, PaginationResponse<ServiceDto>> {
            private readonly ApplicationDbContext _context = context;
            //private readonly IHttpContextAccessor _accessor = accessor;
            //private readonly ITokenService _tokenService = tokenService;

            public async Task<PaginationResponse<ServiceDto>> Handle(
                GetServiceRequest request, CancellationToken cancellationToken
            ) {
                IQueryable<Service>? items;

                if(request.EmployeeId != null)
                {
                    items = _context
                        .Service
                        .Include(i => i.Specialization)
                        .ThenInclude(i => i.Employees)
                        .Where(i => i.Specialization.Employees.Any(e => e.Id == request.EmployeeId));
                } else
                {
                    items = _context
                        .Service
                        .Include(i => i.Specialization);
                }

                //var role = _tokenService.GetClaim(_accessor.HttpContext!.User.Claims, ClaimTypes.Role);

                //if (role != AuthOptions.INIT_ADMIN_ROLE_NAME)
                //{
                //    var employeeId = _tokenService
                //        .GetClaim(_accessor.HttpContext!.User.Claims, CustomClaimTypes.EmployeeId);

                //    items = items.Where(i => i.CreatedBy == Int32.Parse(employeeId));
                //}

                return new PaginationResponse<ServiceDto>(
                    (await items.ToListAsync(cancellationToken)).Adapt<List<ServiceDto>>(),
                    request.Page,
                    request.Size);
            }
        }
    }
}