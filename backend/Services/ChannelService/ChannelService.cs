
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

public class ChannelService : IChannelService
{
    private IChannelRepository _channelRepository;
    private IUserRepository _userRepository;
    private UserManager<User> _userManager;

    public ChannelService(IChannelRepository channelRepository, IUserRepository userRepository, UserManager<User> userManager)
    {
        _channelRepository = channelRepository;
        _userRepository = userRepository;
        _userManager = userManager;
    }

    public async Task<ChannelDto> CreateChannel(string userId, CreateChannelDto dto)
    {
        bool isExist = await isChannelExist(dto.Name);

        if (isExist)
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

        return channels.Select(c => new ChannelDto
        {
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

        if (channel == null)
        {
            return null;
        }

        return new ChannelDto
        {
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

        return channels.Select(c => new ChannelDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            ImageUrl = c.ImageUrl,
            CreatedByUserName = c.CreatedBy.UserName ?? "Unknown"
        });
    }

    public async Task<ChannelDto?> UpdateChannel(Guid id, string userId, UpdateChannelDto dto)
    {
        bool isExist = await isChannelExist(dto.Name); 

        if (isExist)
            throw new Exception("Channel with this name already exists.");

        var user = await _userRepository.GetUserById(userId)
            ?? throw new Exception("User not found.");

        var channel = await GetAuthorizedChannel(id, user);

        bool changed = PropertyUpdater.ApplyChanges(dto, channel);

        if (!changed)
        {
            return null;
        }

        var updatedChannel = await _channelRepository.UpdateChannel(channel);

        return new ChannelDto
        {
            Id = updatedChannel.Id,
            Name = updatedChannel.Name,
            Description = updatedChannel.Description,
            ImageUrl = updatedChannel.ImageUrl,
            CreatedByUserName = user.UserName ?? "Unknown"
        };
    }

    public async Task DeleteChannel(Guid id, string userId)
    {
        var user = await _userRepository.GetUserById(userId)
            ?? throw new Exception("User not found.");

        var channel = await GetAuthorizedChannel(id, user);
        await _channelRepository.DeleteChannel(channel.Id);
    }

    private async Task<Channel> GetAuthorizedChannel(Guid id, User user)
    {
        var channel = await _channelRepository.GetChannelById(id)
           ?? throw new Exception("Channel not found.");

        var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");

        if (channel.CreatedById != user.Id && !isAdmin)
        {
            throw new UnauthorizedAccessException("You don't have permission to update this channel.");
        }

        return channel;
    }

    private async Task<bool> isChannelExist(string name) => await _channelRepository.ChannelNameExists(name);
}