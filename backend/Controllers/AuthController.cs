using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ITokenService _tokenService;

    private readonly IAuthService _authService;

    private readonly IConfiguration _configuration;

    public AuthController(IAuthService authService, ITokenService tokenService, IConfiguration configuration)
    {
        _authService = authService;
        _tokenService = tokenService;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            User user = await _authService.RegisterUser(
                model.Username,
                model.Password,
                model.FirstName,
                model.LastName,
                model.Location,
                model.ProfileImg
            );

            var tokens = await _authService.LoginUser(model.Username, model.Password);

            //Store refresh token in HttpOnly Cookie
            Response.Cookies.Append("refresh_token", tokens!.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(int.Parse(_configuration["Jwt:RefreshTokenExpiration"]!))
            });

            return Ok(new UserResponseDto { Id = user.Id, Username = user.UserName!, AccessToken = tokens!.AccessToken });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var tokens = await _authService.LoginUser(model.Username, model.Password);
        if (tokens == null) return Unauthorized(new { message = "Invalid username or password" });

        //Store refresh token in HttpOnly Cookie
        Response.Cookies.Append("refresh_token", tokens.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(int.Parse(_configuration["Jwt:RefreshTokenExpiration"]!))
        });

        return Ok(new { accessToken = tokens.AccessToken });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken()
    {
        if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
        {
            return Unauthorized("Refresh token is missing.");
        }


        var tokens = await _tokenService.RefreshToken(refreshToken);
        if (tokens == null) return Unauthorized("Invalid or expired refresh token.");

        var isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

        Response.Cookies.Append("refresh_token", tokens.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = !isDevelopment,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        });

        return Ok(new { accessToken = tokens.AccessToken });
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult GetCurrentser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        var username = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst("unique_name")?.Value;
        var roles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(username))
        {
            return Unauthorized(new { message = "Invalid or expired JWT token" });
        }

        return Ok(new { id = userId, username, roles });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        // Retrieve refresh token from HttpOnly cookie
        if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
        {
            return Ok(new { message = "No active session" });
        }

        var success = await _authService.Logout(refreshToken);
        if (!success)
        {
            return Unauthorized("Invalid logout request.");
        }

        // Delete the refresh token cookie
        Response.Cookies.Delete("refresh_token");

        return Ok(new { message = "Logged out successfully" });
    }
}