using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/channels")]
[ApiController]
[Authorize]
public class ChannelsController : ControllerBase
{
    private readonly IChannelService _channelService;

    public ChannelsController(IChannelService channelService)
    {
        _channelService = channelService;
    }

    [HttpGet]
    public async Task<IActionResult> GetChannels()
    {
        var channels = await _channelService.GetAllChannels();

        return Ok(channels);
    }

    [HttpPost]
    public async Task<IActionResult> CreateChannel([FromBody] CreateChannelDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            var channel = await _channelService.CreateChannel(userId, dto);
            return Ok(channel);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetChannelById(Guid id) {
        var channel = await _channelService.GetById(id);

        if(channel == null) {
            return NotFound(new { message = "Channel not found." });
        }

        return Ok(channel);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetChannelsByUserId(string userId) {
        var result = await _channelService.GetChannelsByUserId(userId);
        return Ok(result);
    }
}