using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

[Authorize]
public class ChatHub : Hub
{
    private static readonly Dictionary<string, HashSet<string>> ChannelUsers = new();

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var username = Context.User?.Identity?.Name;

        Console.WriteLine($"[Connected] userId={userId}, username={username}");

        await base.OnConnectedAsync();
    }

    public async Task JoinChannel(string channelId)
    {
        var username = Context.User?.Identity?.Name ?? "Unknown";
        await Groups.AddToGroupAsync(Context.ConnectionId, channelId);
        Console.WriteLine($"[SignalR] User joined channel {channelId}");

        lock (ChannelUsers)
        {
            if (!ChannelUsers.ContainsKey(channelId))
                ChannelUsers[channelId] = new HashSet<string>();

            ChannelUsers[channelId].Add(username);
        }

        await Clients.Group(channelId).SendAsync("UsersUpdated", ChannelUsers[channelId]);
    }

    public async Task SendMessage(string channelId, string username, string message)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userName = Context.User?.Identity?.Name;

        if (userId == null)
        {
            throw new HubException("User is not authenticated.");
        }

        await Clients.Group(channelId).SendAsync("ReceiveMessage", new
        {
            ChannelId = channelId,
            User = userName,
            Text = message,
            SentAt = DateTime.UtcNow
        });
    }

    public async Task LeaveChannel(string channelId)
    {
        var username = Context.User?.Identity?.Name;

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, channelId);

        lock (ChannelUsers)
        {
            if (ChannelUsers.ContainsKey(channelId))
            {
                ChannelUsers[channelId].Remove(username!);

                if (ChannelUsers[channelId].Count == 0)
                    ChannelUsers.Remove(channelId);
            }
        }

        await Clients.Group(channelId).SendAsync("UsersUpdated", ChannelUsers.GetValueOrDefault(channelId, new HashSet<string>()));
    }

    public Task<Dictionary<string, int>> GetOnlineUserCounts()
    {
        var counts = ChannelUsers.ToDictionary(
            kvp => kvp.Key,
            kvp => kvp.Value.Count
        );

        return Task.FromResult(counts);
    }
}