using Microsoft.EntityFrameworkCore;

public class ChannelRepository : IChannelRepository
{
    private readonly AppDbContext _context;

    public ChannelRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Channel>> GetAllChannels()
    {
        return await _context.Channels.Include(c => c.CreatedBy).ToListAsync();
    }

    public async Task<Channel?> GetChannelById(Guid id)
    {
        return await _context.Channels
            .Include(c => c.CreatedBy)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<Channel>> GetChannelsByUserId(string userId)
    {
        return await _context.Channels
            .Where(c => c.CreatedById == userId)
            .Include(c => c.CreatedBy)
            .ToListAsync();
    }

    public async Task<Channel> CreateChannel(Channel channel)
    {
        _context.Channels.Add(channel);
        await _context.SaveChangesAsync();
        return channel;
    }

    public async Task<Channel> UpdateChannel(Channel channel)
    {
        _context.Channels.Update(channel);
        await _context.SaveChangesAsync();
        return channel;
    }

    public async Task<bool> DeleteChannel(Guid id)
    {
        Channel? channel = await _context.Channels.FindAsync(id);
        if (channel == null) return false;

        _context.Channels.Remove(channel);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ChannelNameExists(string name)
    {
        return await _context.Channels.AnyAsync(c => c.Name == name);
    }
}