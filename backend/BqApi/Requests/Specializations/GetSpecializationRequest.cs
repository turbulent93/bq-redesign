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

namespace BeautyQueenApi.Requests.Specializations
{
    public class GetSpecializationRequest() : PaginationRequest, IRequest<PaginationResponse<SpecializationDto>> {
        public class Handler(ApplicationDbContext context
            //IHttpContextAccessor accessor,
            //ITokenService tokenService
        ) : IRequestHandler<GetSpecializationRequest, PaginationResponse<SpecializationDto>> {
            private readonly ApplicationDbContext _context = context;
            //private readonly IHttpContextAccessor _accessor = accessor;
            //private readonly ITokenService _tokenService = tokenService;

            public async Task<PaginationResponse<SpecializationDto>> Handle(
                GetSpecializationRequest request, CancellationToken cancellationToken
            ) {
                IQueryable<Specialization> items = _context.Specialization;

                //var role = _tokenService.GetClaim(_accessor.HttpContext!.User.Claims, ClaimTypes.Role);

                //if(role != AuthOptions.INIT_ADMIN_ROLE_NAME)
                //{
                //    var employeeId = _tokenService
                //        .GetClaim(_accessor.HttpContext!.User.Claims, CustomClaimTypes.EmployeeId);

                //    items = items.Where(i => i.CreatedBy == Int32.Parse(employeeId));
                //}

                return new PaginationResponse<SpecializationDto>(
                    (await items.ToListAsync(cancellationToken)).Adapt<List<SpecializationDto>>(),
                    request.Page,
                    request.Size);
            }
        }
    }
}