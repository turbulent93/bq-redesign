using BeautyQueenApi.Data;
using BqApi.Constants;
using BqApi.Requests.Users;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Users
{
    public class ViewByPhoneUserRequest : IRequest<UserDto> {
        public string Phone { get; set; } = null!;
        
        public class Handler(ApplicationDbContext context) : IRequestHandler<ViewByPhoneUserRequest, UserDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<UserDto> Handle(
                ViewByPhoneUserRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context
                    .User
                    .Include(i => i.Specializations)
                    .Include(i => i.ClientAppointments)
                    .ThenInclude(i => i.Service)
                    .Include(i => i.ClientAppointments)
                    .ThenInclude(i => i.Schedule)
                    .Include(i => i.Promos)
                    .Include(i => i.InvitePromo)
                    .Include(i => i.InvitedUsers)
                    .FirstOrDefaultAsync(i => i.Login == request.Phone, cancellationToken)
                        ?? throw new Exception(ErrorMessages.USER_ERROR);

                var dto = item.Adapt<UserDto>();

                dto.Password = null;

                return dto;
            }
        }
    }
}