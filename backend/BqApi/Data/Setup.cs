namespace BeautyQueenApi.Data;

public static class Setup
{
    public static async Task InitializeDatabaseAsync(this IHost host) {
        using var scope = host.Services.CreateScope();

        await scope.ServiceProvider
            .GetRequiredService<DbInitializer>()
            .InitializeAsync();
    }
}
