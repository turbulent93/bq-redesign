using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Pagination;
using BqApi.Requests.Users;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Users
{
    public class GetEmployeesRequest : PaginationRequest, IRequest<PaginationResponse<EmployeeDto>> {
        public int? ServiceId { get; set; }
        public class Handler(ApplicationDbContext context) : IRequestHandler<GetEmployeesRequest, PaginationResponse<EmployeeDto>> {
            private readonly ApplicationDbContext _context = context;
            public async Task<PaginationResponse<EmployeeDto>> Handle(
                GetEmployeesRequest request, CancellationToken cancellationToken
            ) {
                IQueryable<Employee> items = _context
                        .Employee
                        .Include(i => i!.Specializations)
                        .Include(i => i.File);

                if (request.ServiceId != null)
                {
                    items = items
                        .Where(i => i.Specializations.Any(s => s.Services.Any(a => a.Id == request.ServiceId)));
                }

                return new PaginationResponse<EmployeeDto>(
                    (await items.ToListAsync(cancellationToken)).Adapt<List<EmployeeDto>>(),
                    request.Page,
                    request.Size
                );
            }
        }
    }
}