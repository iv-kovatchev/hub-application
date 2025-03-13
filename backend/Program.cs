using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add Database Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container.
// Configure ASP.Net Identity
builder.Services.ConfigureIdentity();

var jwtKey = builder.Configuration["Jwt:SecretKey"];

if (string.IsNullOrEmpty(jwtKey))
{
    throw new Exception("🚨 JWT Secret Key is missing! Add it to appsettings.json.");
}

var key = Encoding.UTF8.GetBytes(jwtKey!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            RequireExpirationTime = true,
            ValidateLifetime = true
        };
    });

builder.Services.AddAuthorization();

builder.Services.ConfigureServices();

var app = builder.Build();

//Create default roles (Admin & User) on Startup
using (var scope = app.Services.CreateScope())
{
    IServiceProvider? serviceProvider = scope.ServiceProvider;
    await RoleConfiguration.InitializeRoleAsync(serviceProvider);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
Console.WriteLine("✅ Routing Applied.");
app.UseHttpsRedirection();
app.UseAuthentication();
Console.WriteLine("✅ Authentication Applied.");
app.UseAuthorization();
Console.WriteLine("✅ Authorization Applied.");
app.MapControllers();

app.Run();
