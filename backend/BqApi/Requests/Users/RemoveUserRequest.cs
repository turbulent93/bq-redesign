using BeautyQueenApi.Constants;
using BeautyQueenApi.Data;
using BqApi.Constants;
using BqApi.Requests.Users;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Users
{
    public class RemoveUserRequest : IRequest<UserDto> {
        public int Id { get; set; }
        
        public class Handler(ApplicationDbContext context) : IRequestHandler<RemoveUserRequest, UserDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<UserDto> Handle(
                RemoveUserRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context.User.FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                    ?? throw new Exception(ErrorMessages.USER_ERROR);

                if(item.Login == AuthOptions.INIT_ADMIN_LOGIN)
                {
                    throw new Exception(ErrorMessages.ADMIN_CANNOT_BE_DELETED);
                }

                _context.User.Remove(item);
                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<UserDto>();
            }
        }
    }
}