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
using Microsoft.Extensions.Hosting;
using System.Security.Claims;

namespace BeautyQueenApi.Data
{
    public class ApplicationDbContext(
        DbContextOptions options,
        IHttpContextAccessor accessor
    ) : DbContext(options)
    {
        private readonly IHttpContextAccessor _accessor = accessor;

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
                //var userId = _accessor.HttpContext!.User.Claims
                //    .Where(c => c.Type == CustomClaimTypes.Id)
                //    .Select(x => x.Value)
                //    .FirstOrDefault()!;

                var changedEntries = ChangeTracker
                    .Entries<ITrackedEntity>()
                    .Where(i => i.State == EntityState.Added);

                foreach (var entry in changedEntries)
                {
                    //entry.Entity.Update(Int32.Parse(userId));
                    entry.Entity.Update(DateTime.Now);
                }
            }

            return await base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Appointment>()
                .HasOne(i => i.Employee)
                .WithMany(i => i.EmployeeAppointments)
                .HasForeignKey(i => i.EmployeeId);

            modelBuilder.Entity<Appointment>()
                .HasOne(i => i.Client)
                .WithMany(i => i.ClientAppointments)
                .HasForeignKey(i => i.ClientId);

            modelBuilder.Entity<User>()
                .HasOne(i => i.PunchMap)
                .WithMany(i => i.Clients)
                .HasForeignKey(i => i.PunchMapId);

            modelBuilder.Entity<PunchMap>()
                .HasOne(i => i.Employee)
                .WithMany(i => i.PunchMaps)
                .HasForeignKey(i => i.EmployeeId);


            modelBuilder.Entity<User>()
                .HasOne(i => i.InvitePromo)
                .WithMany(i => i.InvitePromoUsers)
                .HasForeignKey(i => i.InvitePromoId)
                .IsRequired(false);
        }
    }
}
