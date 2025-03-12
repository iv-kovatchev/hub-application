using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/channels")]
[ApiController]
public class ChannelsController : ControllerBase
{
    private readonly ILogger<ChannelsController> _logger;
    
    public ChannelsController(ILogger<ChannelsController> logger)
    {
        _logger = logger;
            _logger.LogInformation("✅ ChannelsController Loaded!");
    }

    [Authorize]
    [HttpGet]
    public IActionResult GetChannels()
    {
        Console.WriteLine("✅ GetChannels() API Called!");
        return Ok();
    }
}