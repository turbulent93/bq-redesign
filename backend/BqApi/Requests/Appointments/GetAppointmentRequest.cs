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

namespace BeautyQueenApi.Requests.Appointments
{
    public class GetAppointmentRequest : PaginationRequest, IRequest<PaginationResponse<AppointmentDto>> {
        public int EmployeeId { get; set; }
        public int? ScheduleId { get; set; }

        public class Handler(ApplicationDbContext context
            //IHttpContextAccessor accessor,
            //ITokenService tokenService
        ) : IRequestHandler<GetAppointmentRequest, PaginationResponse<AppointmentDto>> {
            private readonly ApplicationDbContext _context = context;
            //private readonly IHttpContextAccessor _accessor = accessor;
            //private readonly ITokenService _tokenService = tokenService;

            public async Task<PaginationResponse<AppointmentDto>> Handle(
                GetAppointmentRequest request, CancellationToken cancellationToken
            ) {
                IQueryable<Appointment> items = _context
                    .Appointment
                    .Where(i => i.EmployeeId == request.EmployeeId)
                    .Include(i => i.Service)
                    .Include(i => i.Schedule)
                    .Include(i => i.Client);

                if(request.ScheduleId != null)
                {
                    items = items.Where(i => i.ScheduleId == request.ScheduleId);
                }

                //var role = _tokenService.GetClaim(_accessor.HttpContext!.User.Claims, ClaimTypes.Role);

                //if (role != AuthOptions.INIT_ADMIN_ROLE_NAME)
                //{
                //    var employeeId = _tokenService
                //        .GetClaim(_accessor.HttpContext!.User.Claims, CustomClaimTypes.EmployeeId);

                //    items = items.Where(i => i.CreatedBy == Int32.Parse(employeeId));
                //}

                return new PaginationResponse<AppointmentDto>(
                    (await items.ToListAsync(cancellationToken)).Adapt<List<AppointmentDto>>(),
                    request.Page,
                    request.Size);
            }
        }
    }
}