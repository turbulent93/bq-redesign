using BeautyQueenApi.Constants;
using BeautyQueenApi.Data;
using BeautyQueenApi.Services.TokenService;
using BeautyQueenApi.Services.UploadService;
using BqApi.Codegen;
using BqApi.Services.ScheduleService;
using BqApi.Services.StatisticService;
using BqApi.TgBot;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(p => p.AddPolicy("FrontendPolicy", build =>
{
    build.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
}));

builder.Services.AddControllers().AddNewtonsoftJson();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<ITokenService, TokenService>();
builder.Services.AddTransient<IScheduleService, ScheduleService>();
builder.Services.AddTransient<IStatisticService, StatisticService>();
builder.Services.AddTransient<IUploadService, UploadService>();
builder.Services.AddTransient<ITgBotService, TgBotService>();

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = AuthOptions.ValidateAudience,
            ValidateIssuer = AuthOptions.ValidateIssuer,
            ValidateIssuerSigningKey = AuthOptions.ValidateIssuerSigningKey,
            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
            ClockSkew = TimeSpan.Zero
        };
    });

//builder.Services.AddHttpContextAccessor();

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql("Host=localhost;Port=5432;Database=bq;Password=1234;Username=postgres"));

var config = TypeAdapterConfig.GlobalSettings;

config.Scan(Assembly.GetExecutingAssembly());

builder.Services.AddSingleton(config);
//builder.Services.AddScoped<IMapper, ServiceMapper>();

builder.Services.AddSwaggerDocument();

builder.Services.AddTransient<CodeGenerationService>();
builder.Services.AddTransient<DbInitializer>();

var app = builder.Build();

await app.InitializeDatabaseAsync();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseOpenApi();
//app.UseSwaggerUi3();

app.UseCors("FrontendPolicy");

app.UseStaticFiles();

//app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers().RequireAuthorization();

await app.Services.GetRequiredService<CodeGenerationService>().InitializeAsync();

app.Run();
