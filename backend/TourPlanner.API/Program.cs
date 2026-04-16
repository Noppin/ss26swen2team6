using System.Text;
using log4net;
using log4net.Config;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TourPlanner.BL.HttpClients;
using TourPlanner.BL.Services;
using TourPlanner.BL.Services.Interfaces;
using TourPlanner.DAL.Context;
using TourPlanner.DAL.Repositories;
using TourPlanner.DAL.Repositories.Interfaces;

// Configure log4net
var logRepo = LogManager.GetRepository(System.Reflection.Assembly.GetEntryAssembly()!);
XmlConfigurator.Configure(logRepo, new FileInfo("log4net.config"));
var log = LogManager.GetLogger(typeof(Program));

var builder = WebApplication.CreateBuilder(args);

// Configuration from env variables overrides appsettings
builder.Configuration.AddEnvironmentVariables();

// Database
builder.Services.AddDbContext<TourPlannerDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// Repositories (Repository Pattern)
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITourRepository, TourRepository>();
builder.Services.AddScoped<ITourLogRepository, TourLogRepository>();

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITourService, TourService>();
builder.Services.AddScoped<ITourLogService, TourLogService>();
builder.Services.AddScoped<IRouteService, RouteService>();

// OpenRouteService HTTP Client
builder.Services.Configure<OrsOptions>(builder.Configuration.GetSection(OrsOptions.Section));
builder.Services.AddHttpClient<IOpenRouteServiceClient, OpenRouteServiceClient>();

// JWT Authentication
var jwtKey = builder.Configuration["JwtSettings:SecretKey"]
    ?? throw new InvalidOperationException("JWT SecretKey not configured");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });
builder.Services.AddAuthorization();

// CORS
var allowedOrigins = builder.Configuration["AllowedOrigins"] ?? "http://localhost:5173";
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins.Split(','))
              .AllowAnyHeader()
              .AllowAnyMethod()));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter()));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Auto-migrate on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TourPlannerDbContext>();
    try
    {
        db.Database.Migrate();
        log.Info("Database migration completed.");
    }
    catch (Exception ex)
    {
        log.Error($"Database migration failed: {ex.Message}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Serve uploaded images at /images/{filename}
var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "uploads");
Directory.CreateDirectory(uploadsPath);
var mimeProvider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
mimeProvider.Mappings[".png"] = "image/png";
mimeProvider.Mappings[".jpg"] = "image/jpeg";
mimeProvider.Mappings[".jpeg"] = "image/jpeg";
mimeProvider.Mappings[".gif"] = "image/gif";
mimeProvider.Mappings[".webp"] = "image/webp";

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
    RequestPath = "/images",
    ContentTypeProvider = mimeProvider
});

app.MapControllers();

log.Info("TourPlanner API starting...");
app.Run();

public partial class Program { }
