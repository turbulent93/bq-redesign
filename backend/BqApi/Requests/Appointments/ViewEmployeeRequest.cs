using BeautyQueenApi.Data;
using BqApi.Constants;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Appointments
{
    public class ViewAppointmentRequest : IRequest<AppointmentDto> {
        public int Id { get; set; }
        
        public class Handler(ApplicationDbContext context)
                : IRequestHandler<ViewAppointmentRequest, AppointmentDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<AppointmentDto> Handle(
                ViewAppointmentRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context
                    .Appointment
                    .Include(i => i.Client)
                    .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                        ?? throw new Exception(ErrorMessages.APPOINTMENT_ERROR);

                return item.Adapt<AppointmentDto>();
            }
        }
    }
}