using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

public static class ServiceConfiguration
{
    public static void ConfigureIdentity(this IServiceCollection services)
    {
        services.AddIdentity<User, IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>()
            .AddRoles<IdentityRole>()
            .AddDefaultTokenProviders();
    }

    public static void ConfigureServices(this IServiceCollection services)
    {   
        services.AddControllers();
        services.AddSwaggerGen();
        services.AddEndpointsApiExplorer();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IAuthService, AuthService>();
    }
}