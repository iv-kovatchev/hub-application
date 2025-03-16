using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/admin")]
[ApiController]
public class AdminController() : ControllerBase {

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public IActionResult GetChannels2()
    {
        return Ok(new { message = "Welcome, Admin! You have secure access." });
    }
}