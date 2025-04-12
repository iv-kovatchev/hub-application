public interface IChannelRepository
{

    Task<IEnumerable<Channel>> GetAllChannels();

    Task<IEnumerable<Channel>> GetChannelsByUserId(string userId);

    Task<Channel?> GetChannelById(Guid id);

    Task<Channel> CreateChannel(Channel channel);

    Task<Channel> UpdateChannel(Channel channel);

    Task<bool> DeleteChannel(Guid id);

    Task<bool> ChannelNameExists(string name);
}