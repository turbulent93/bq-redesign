using BeautyQueenApi.Data;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Appointments
{
    public class RemoveAppointmentRequest : IRequest<AppointmentDto> {
        public int Id { get; set; }
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<RemoveAppointmentRequest, AppointmentDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<AppointmentDto> Handle(
                RemoveAppointmentRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context
                        .Appointment
                        .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                    ?? throw new Exception(ErrorMessages.APPOINTMENT_ERROR);

                _context.Appointment.Remove(item);
                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<AppointmentDto>();
            }
        }
    }
}