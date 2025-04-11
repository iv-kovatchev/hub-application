
public class ChannelService : IChannelService
{
    private IChannelRepository _channelRepository;
    private IUserRepository _userRepository;

    public ChannelService(IChannelRepository channelRepository, IUserRepository userRepository)
    {
        _channelRepository = channelRepository;
        _userRepository = userRepository;
    }

    public async Task<ChannelDto> CreateChannel(string userId, CreateChannelDto dto)
    {
        var nameExists  = await _channelRepository.ChannelNameExists(dto.Name);

        if (nameExists)
            throw new Exception("Channel with this name already exists.");

        var user = await _userRepository.GetUserById(userId);

        var channel = new Channel
        {
            Name = dto.Name,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            CreatedById = userId,
            CreatedBy = user!
        };

        var createdChannel = await _channelRepository.CreateChannel(channel);

        return new ChannelDto
        {
            Id = createdChannel.Id,
            Name = createdChannel.Name,
            Description = createdChannel.Description,
            ImageUrl = createdChannel.ImageUrl,
            CreatedByUserName = user!.UserName ?? "Unknown"
        };
    }

    public async Task<IEnumerable<ChannelDto>> GetAllChannels()
    {
        var channels = await _channelRepository.GetAllChannels();

        return channels.Select(c => new ChannelDto {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            ImageUrl = c.ImageUrl,
            CreatedByUserName = c.CreatedBy.UserName ?? "Unknown"
        });
    }

    public async Task<ChannelDto?> GetById(Guid id)
    {
        var channel = await _channelRepository.GetChannelById(id);

        if(channel == null) {
            return null;
        }

        return new ChannelDto {
            Id = channel.Id,
            Name = channel.Name,
            Description = channel.Description,
            ImageUrl = channel.ImageUrl,
            CreatedByUserName = channel.CreatedBy.UserName ?? "Unknown"
        };
    }

    public async Task<IEnumerable<ChannelDto>> GetChannelsByUserId(string userId)
    {
        var channels = await _channelRepository.GetChannelsByUserId(userId);

        return channels.Select(c => new ChannelDto {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            ImageUrl = c.ImageUrl,
            CreatedByUserName = c.CreatedBy.UserName ?? "Unknown"
        });
    }
}