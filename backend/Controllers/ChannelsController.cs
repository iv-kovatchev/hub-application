using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/channels")]
[ApiController]
public class ChannelsController : ControllerBase
{
    [Authorize]
    [HttpGet]
    public IActionResult GetChannels()
    {
        return Ok();
    }

    [HttpGet]
    [Route("admin")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetChannels2()
    {
        return Ok();
    }
}