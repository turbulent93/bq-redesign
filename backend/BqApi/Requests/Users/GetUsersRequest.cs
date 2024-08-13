using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Pagination;
using BqApi.Requests.Users;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Users
{
    public class GetUsersRequest : PaginationRequest, IRequest<PaginationResponse<UserDto>> {
        public bool? IsNotEmployee { get; set; }
        public class Handler(ApplicationDbContext context) : IRequestHandler<GetUsersRequest, PaginationResponse<UserDto>> {
            private readonly ApplicationDbContext _context = context;
            public async Task<PaginationResponse<UserDto>> Handle(
                GetUsersRequest request, CancellationToken cancellationToken
            ) {
                IQueryable<User> items = _context
                        .User
                        .Include(i => i.Employee)
                        .ThenInclude(i => i!.Specializations)
                        .Include(i => i.Employee)
                        .ThenInclude(i => i!.File);

                if (request.IsNotEmployee == true)
                {
                    items = items
                        .Where(i => i.Employee == null);
                }

                return new PaginationResponse<UserDto>(
                    (await items.ToListAsync(cancellationToken)).Adapt<List<UserDto>>(),
                    request.Page,
                    request.Size
                );
            }
        }
    }
}