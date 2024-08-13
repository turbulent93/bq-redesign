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
                Appointment? item = new(request.Phone,
                    TimeOnly.Parse(request.StartAt),
                    TimeOnly.Parse(request.EndAt),
                    request.EmployeeId,
                    request.ScheduleId,
                    request.ServiceId);

                _context.Appointment.Add(item);

                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<AppointmentDto>();
            }
        }
    }
}