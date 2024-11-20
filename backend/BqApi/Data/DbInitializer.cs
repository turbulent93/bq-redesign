using BeautyQueenApi.Constants;
using BeautyQueenApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BeautyQueenApi.Data;

public class DbInitializer(
    ApplicationDbContext context)
{
    private readonly ApplicationDbContext _context = context;

    public async Task SeedingUsersAsync() {
        var admin = await _context.User.AnyAsync(u => u.Login == AuthOptions.INIT_ADMIN_LOGIN);

        if(!admin) {
            await _context.User.AddAsync(new User
            (
                AuthOptions.INIT_ADMIN_LOGIN,
                BCrypt.Net.BCrypt.HashPassword(AuthOptions.INIT_USER_PASSWORD),
                AuthOptions.INIT_ADMIN_ROLE_NAME,
                null,
                null
            ));
        }

        await _context.SaveChangesAsync();
    }

    public async Task InitializeAsync()
    {
        await SeedingUsersAsync();
    }
}
