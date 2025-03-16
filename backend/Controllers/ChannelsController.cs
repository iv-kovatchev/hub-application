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
        var dummyChannels = new List<object>
        {
            new { Id = 1, Name = "General", Description = "General discussion channel" },
            new { Id = 2, Name = "Tech Talk", Description = "Discuss latest tech trends" },
            new { Id = 3, Name = "Gaming", Description = "All about gaming and fun" },
            new { Id = 4, Name = "Music", Description = "Share and talk about music" }
        };

        return Ok(dummyChannels);
    }
}