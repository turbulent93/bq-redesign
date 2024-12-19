using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.Pagination;
using BqApi.Constants;
using BqApi.Requests.Users;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Users
{
    public class CreateOrUpdateUserRequest : UserDto, IRequest<UserDto>
    {
        public class Handler(ApplicationDbContext context) : IRequestHandler<CreateOrUpdateUserRequest, UserDto>
        {
            private readonly ApplicationDbContext _context = context;
            public async Task<UserDto> Handle(
                CreateOrUpdateUserRequest request, CancellationToken cancellationToken
            )
            {
                User? item;
                if (request.Id != null)
                {
                    item = await _context
                        .User
                        .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                            ?? throw new Exception(ErrorMessages.USER_ERROR);

                    if (request.Password != null && request.NewPassword != null)
                    {
                        if (!BCrypt.Net.BCrypt.Verify(request.Password, item.Password))
                        {
                            throw new Exception(ErrorMessages.AUTHENTICATE_ERROR);
                        }
                        item.Update(request, BCrypt.Net.BCrypt.HashPassword(request.NewPassword));
                    }
                    else
                    {
                        item.Update(request);
                    }
                }
                else
                {
                    item = new(
                        request.Login,
                        request.Password != null ? BCrypt.Net.BCrypt.HashPassword(request.Password) : null,
                        request.Role,
                        request.PunchMapId,
                        request.StepsCount,
                        request.FullName,
                        request.AvatarId,
                        null,
                        null,
                        request.StartWorkTime,
                        request.EndWorkTime
                    );

                    _context.User.Add(item);
                }

                await _context.SaveChangesAsync(cancellationToken);

                _context.Entry(item).Collection(i => i.Specializations).Load();

                foreach (var i in request.SpecializationIds)
                {
                    if(item.Specializations.FirstOrDefault(s => s.Id == i) == null)
                    {
                        var specialization = await _context.Specialization.FirstOrDefaultAsync(s => s.Id == i, cancellationToken)
                            ?? throw new Exception(ErrorMessages.SPECIALIZATION_ERROR);

                        item.Specializations.Add(specialization);
                    }
                }

                var specializationsToRemove = new List<Specialization>();

                foreach(var i in item.Specializations)
                {
                    if(!request.SpecializationIds.Contains(i.Id))
                    {
                        specializationsToRemove.Add(i);
                    }
                }

                foreach(var i in specializationsToRemove)
                {
                    item.Specializations.Remove(i);
                }

                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<UserDto>();
            }
        }
    }
}