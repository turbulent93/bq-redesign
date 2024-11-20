using BeautyQueenApi.Data;
using BeautyQueenApi.Models;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Appointments
{
    public class CreateAppointmentRequest : AppointmentDto, IRequest<AppointmentDto> {
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<CreateAppointmentRequest, AppointmentDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<AppointmentDto> Handle(
                CreateAppointmentRequest request, CancellationToken cancellationToken
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
                        "Клиент",
                        null,
                        null
                    );

                    _context.User.Add(user);

                    _context.Entry(user).Collection(i => i.Promos).Load();

                    await _context.SaveChangesAsync(cancellationToken);
                }

                Appointment? item = new(user!.Id,
                    TimeOnly.Parse(request.StartAt),
                    TimeOnly.Parse(request.EndAt),
                    request.EmployeeId,
                    request.ScheduleId,
                    request.ServiceId,
                    request.PaidWithBonuses != null ? (int)request.PaidWithBonuses : 0,
                    request.PromoId);

                _context.Appointment.Add(item);

                await _context.SaveChangesAsync(cancellationToken);


                if(request.PromoId != null)
                {
                    var promo = await _context.Promo.FirstOrDefaultAsync(i => i.Id == request.PromoId, cancellationToken)
                        ?? throw new Exception(ErrorMessages.PROMO_ERROR);

                    if(user.Promos.Contains(promo))
                    {
                        throw new Exception("Эта акция уже была использована");
                    } else
                    {
                        user.Promos.Add(promo);
                    }
                }

                user.AddStep();

                user.Appointments.Add(item);

                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<AppointmentDto>();
            }
        }
    }
}