using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Pagination;
using BqApi.Constants;
using BqApi.Requests.Users;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace BeautyQueenApi.Requests.Users
{
    public class PartialUpdateUserRequest : PartialUserUpdateDto, IRequest<UserDto>
    {
        public class Handler(ApplicationDbContext context) : IRequestHandler<PartialUpdateUserRequest, UserDto>
        {
            private readonly ApplicationDbContext _context = context;
            public async Task<UserDto> Handle(
                PartialUpdateUserRequest request, CancellationToken cancellationToken
            )
            {
                var item = await _context
                    .User
                    .Include(i => i.Promos)
                    .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                        ?? throw new Exception(ErrorMessages.USER_ERROR);

                int? invitePromoId = null;

                if (request.PromoId != null)
                {
                    var promo = await _context.Promo.FirstOrDefaultAsync(i => i.Id == request.PromoId, cancellationToken)
                        ?? throw new Exception(ErrorMessages.PROMO_ERROR);

                    if(promo.Type == PromoTypes.PROMO_TYPE_INVITE)
                    {
                        invitePromoId = promo.Id;
                    } else if(!item.Promos.Contains(promo))
                    {
                        item.Promos.Add(promo);
                    }
                }

                item.PartialUpdate(request.Phone, request.PunchMapId, invitePromoId);

                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<UserDto>();
            }
        }
    }
}