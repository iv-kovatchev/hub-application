using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

public static class TokenConfiguration
{
    public static void TokenServices(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtKey = configuration["Jwt:SecretKey"];

        if (string.IsNullOrEmpty(jwtKey))
        {
            throw new Exception("JWT Secret Key is missing! Add it to appsettings.json.");
        }

        var jwtSettings = configuration.GetSection("Jwt");
        var key = Encoding.UTF8.GetBytes(jwtKey!);

        services.AddAuthentication(options =>
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
                ValidIssuer = jwtSettings["Issuer"],
                ValidAudience = jwtSettings["Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!)),
                ValidateIssuer = true,
                ValidateAudience = true,
                RequireExpirationTime = true,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            //Enable reading token from HttpOnly cookie
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {

                    var accessToken = context.Request.Query["access_token"];

                    var path = context.HttpContext.Request.Path;
                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chatHub"))
                    {
                        context.Token = accessToken;
                    }
                    else
                    {
                        // Fallback: accept token from cookie for normal API calls
                        context.Token = context.Request.Cookies["access_token"];
                    }

                    return Task.CompletedTask;
                }
            };
        });
    }
}