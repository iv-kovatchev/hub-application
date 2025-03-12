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

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
