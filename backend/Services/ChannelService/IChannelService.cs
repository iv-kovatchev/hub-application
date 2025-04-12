public interface IChannelService
{
    Task<ChannelDto> CreateChannel(string userId, CreateChannelDto dto);
    Task<IEnumerable<ChannelDto>> GetAllChannels();
    Task<IEnumerable<ChannelDto>> GetChannelsByUserId(string userId);
    Task<ChannelDto?> GetById(Guid id);
    Task<ChannelDto?> UpdateChannel(Guid id, string userId, UpdateChannelDto dto);
    Task DeleteChannel(Guid id, string userId);
}