using BeautyQueenApi.Constants;
using BeautyQueenApi.Data;
using BqApi.Constants;
using BqApi.Requests.Users;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Requests.Users
{
    public class RemoveEmployeeRequest : IRequest<EmployeeDto> {
        public int Id { get; set; }
        
        public class Handler(ApplicationDbContext context) : IRequestHandler<RemoveEmployeeRequest, EmployeeDto> {
            private readonly ApplicationDbContext _context = context;

            public async Task<EmployeeDto> Handle(
                RemoveEmployeeRequest request, CancellationToken cancellationToken
            ) {
                var item = await _context.Employee.FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken)
                    ?? throw new Exception(ErrorMessages.MASTER_ERROR);

                _context.Employee.Remove(item);
                await _context.SaveChangesAsync(cancellationToken);

                return item.Adapt<EmployeeDto>();
            }
        }
    }
}