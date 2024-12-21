using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace BeautyQueenApi.Requests.Appointments
{
    public class CreateOrUpdateAppointmentRequest : AppointmentDto, IRequest<AppointmentDto> {
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<CreateOrUpdateAppointmentRequest, AppointmentDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<AppointmentDto> Handle(
                CreateOrUpdateAppointmentRequest request, CancellationToken cancellationToken
            ) {
                var user = await _context
                        .User
                        .Include(i => i.Promos)
                        .FirstOrDefaultAsync(i => i.Login == request.Phone, cancellationToken);

                if (user == null)
                {
                    user = new User(
                        request.Phone,
                        null,
                        RoleNames.CLIENT_ROLE_NAME,
                        null,
                        null,
                        null,
                        null,
                        request.InviterId
                    );

                    _context.User.Add(user);

                    //_context.Entry(user).Collection(i => i.Promos).Load();

                    await _context.SaveChangesAsync(cancellationToken);
                }

                Appointment? item;

                if(request.Id != null)
                {
                    item = await _context.Appointment.FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                        ?? throw new Exception(ErrorMessages.APPOINTMENT_ERROR);


                    item.Update(request, user.Id);
                } else
                {
                    TimeOnly.TryParseExact(request.StartAt, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly startAt);
                    TimeOnly.TryParseExact(request.EndAt, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly endAt);

                    item = new(user.Id,
                        startAt,
                        endAt,
                        request.EmployeeId,
                        request.ScheduleId,
                        request.ServiceId,
                        request.PaidWithBonuses != null ? (int)request.PaidWithBonuses : 0,
                        request.PromoId);

                    _context.Appointment.Add(item);

                    await _context.SaveChangesAsync(cancellationToken);


                    if (request.PromoId != null)
                    {
                        var promo = await _context.Promo.FirstOrDefaultAsync(i => i.Id == request.PromoId, cancellationToken)
                            ?? throw new Exception(ErrorMessages.PROMO_ERROR);

                        if (user.Promos.Contains(promo))
                        {
                            throw new Exception("Эта акция уже была использована");
                        }
                        else
                        {
                            user.Promos.Add(promo);
                        }
                    }

                    user.AddStep();

                    user.ClientAppointments.Add(item);

                    if (request.InviterId != null && user.Id != request.InviterId)
                    {
                        var inviter = await _context
                            .User
                            .Include(i => i.InvitedUsers)
                            .FirstOrDefaultAsync(i => i.Id == request.InviterId, cancellationToken)
                                ?? throw new Exception(ErrorMessages.USER_ERROR);

                        if (!inviter.InvitedUsers.Contains(user))
                        {
                            inviter.InvitedUsers.Add(user);
                        }
                    }
                }

                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<AppointmentDto>();
            }
        }
    }
}