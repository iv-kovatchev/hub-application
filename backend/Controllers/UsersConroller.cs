using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/users")]
[ApiController]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        this._userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userService.GetAllUsers();

        return Ok(users);
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateOwnProfile([FromBody] UpdateUserDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (userId == null)
            return Unauthorized();

        var updated = await _userService.UpdateUser(userId, dto);
        return Ok(updated);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/ban")]
    public async Task<IActionResult> BanUser(string id)
    {
        try
        {
            await _userService.BanUser(id);

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}