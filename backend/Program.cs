using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add Database Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container.
// Configure ASP.Net Identity
builder.Services.ConfigureIdentity();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
        });
});

builder.Services.TokenServices(builder.Configuration);

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
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");

        // ✅ Allow Swagger UI to work on HTTP
        options.EnableTryItOutByDefault();
    });
}

app.UseRouting();
app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
