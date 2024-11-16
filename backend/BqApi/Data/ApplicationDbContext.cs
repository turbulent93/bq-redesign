using BeautyQueenApi.Constants;
using BeautyQueenApi.Models;
using BeautyQueenApi.Requests.PunchMaps;
using BeautyQueenApi.Services.TokenService;
using BqApi.Models;
using BqApi.Models.Audit;
using BqApi.Services.TokenService;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using System.Security.Claims;

namespace BeautyQueenApi.Data
{
    public class ApplicationDbContext(
        DbContextOptions options,
        IHttpContextAccessor accessor
    ) : DbContext(options)
    {
        private readonly IHttpContextAccessor _accessor = accessor;

        public DbSet<Employee> Employee { get; set; }
        public DbSet<Service> Service { get; set; }
        public DbSet<Specialization> Specialization { get; set; }
        public DbSet<Schedule> Schedule { get; set; }
        public DbSet<Appointment> Appointment { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<UploadedFile> File { get; set; }
        public DbSet<Promo> Promo { get; set; }
        public DbSet<PromoService> PromoService { get; set; }
        public DbSet<ServiceGroup> ServiceGroup { get; set; }
        public DbSet<Gallery> Gallery { get; set; }
        public DbSet<PunchMap> PunchMap { get; set; }
        public DbSet<PunchMapPromo> PunchMapPromo { get; set; }

        public override async Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            if(_accessor.HttpContext != null)
            {
                var userId = _accessor.HttpContext!.User.Claims
                    .Where(c => c.Type == CustomClaimTypes.Id)
                    .Select(x => x.Value)
                    .FirstOrDefault()!;

                var changedEntries = ChangeTracker
                    .Entries<ITrackedEntity>()
                    .Where(i => i.State == EntityState.Added);

                foreach (var entry in changedEntries)
                {
                    entry.Entity.Update(Int32.Parse(userId));
                }
            }

            return await base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }
    }
}
