using BeautyQueenApi.Data;
using BqApi.Constants;
using BqApi.Requests.Users;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Users
{
    public class ViewUserRequest : IRequest<UserDto> {
        public int Id { get; set; }
        
        public class Handler(ApplicationDbContext context) : IRequestHandler<ViewUserRequest, UserDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<UserDto> Handle(
                ViewUserRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context
                    .User
                    .Include(i => i.Employee)
                    .ThenInclude(i => i!.Specializations)
                    .Include(i => i.Appointments)
                    .ThenInclude(i => i.Service)
                    .Include(i => i.Appointments)
                    .ThenInclude(i => i.Schedule)
                    .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                        ?? throw new Exception(ErrorMessages.USER_ERROR);

                var dto = item.Adapt<UserDto>();

                dto.Password = null;

                return dto;
            }
        }
    }
}