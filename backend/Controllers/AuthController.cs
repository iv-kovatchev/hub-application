using Microsoft.AspNetCore.Mvc;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
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
            
            return Ok(new UserResponseDto { Id = user.Id, Username = user.UserName! });
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

        var token = await _authService.LoginUser(model.Username, model.Password);
        if (token == null) return Unauthorized(new { message = "Invalid username or password" });

        return Ok(new { token });
    }
}