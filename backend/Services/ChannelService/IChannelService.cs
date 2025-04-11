public interface IChannelService
{
    Task<ChannelDto> CreateChannel(string userId, CreateChannelDto dto);
    Task<IEnumerable<ChannelDto>> GetAllChannels();
    Task<IEnumerable<ChannelDto>> GetChannelsByUserId(string userId);
    Task<ChannelDto?> GetById(Guid id);
    //Task<bool> UpdateChannel(Guid id, string userId, CreateChannelDto dto);
    //Task<bool> DeleteChannel(Guid id, string userId);
}