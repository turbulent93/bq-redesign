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
                var user = await CreateOrUpdateUser(request, cancellationToken);
                if(request.Employee != null)
                {
                    request.Employee.UserId = (int)user.Id!;
                    await CreateOrUpdateEmployee(request.Employee, cancellationToken);
                }

                return user;
            }
            private async Task<UserDto> CreateOrUpdateUser(UserDto request, CancellationToken cancellationToken)
            {
                User? item;
                if (request.Id != null)
                {
                    item = await _context
                        .User
                        .Include(i => i.Employee)
                        .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                            ?? throw new Exception(ErrorMessages.USER_ERROR);

                    if(request.Password != null && request.NewPassword != null)
                    {
                        if (!BCrypt.Net.BCrypt.Verify(request.Password, item.Password))
                        {
                            throw new Exception(ErrorMessages.AUTHENTICATE_ERROR);
                        }
                        item.Update(request.Login,
                            BCrypt.Net.BCrypt.HashPassword(request.NewPassword),
                            request.Role);
                    } else
                    {
                        item.Update(request.Login,
                            null,
                            request.Role);
                    }
                }
                else
                {
                    item = new(
                        request.Login,
                        BCrypt.Net.BCrypt.HashPassword(request.Password),
                        request.Role,
                        request.PunchMapId
                    );

                    _context.User.Add(item);
                }

                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<UserDto>();
            }

            private async Task<EmployeeDto> CreateOrUpdateEmployee(EmployeeDto request, CancellationToken cancellationToken)
            {
                Employee? item;
                if (request.Id != null)
                {
                    item = await _context
                            .Employee
                            .Include(i => i.Specializations)
                            .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                        ?? throw new Exception(ErrorMessages.MASTER_ERROR);

                    item.Update(request);

                    //item.Specializations.Clear();

                    item.Specializations = [.. _context
                        .Specialization
                        .Where(i => request.SpecializationIds.Contains(i.Id))];
                }
                else
                {
                    item = new(request.FullName, request.UserId, request.FileId);

                    _context.Employee.Add(item);

                    item.Specializations = [.. _context
                        .Specialization
                        .Where(i => request.SpecializationIds.Contains(i.Id))];
                }

                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<EmployeeDto>();
            }
        }
    }
}