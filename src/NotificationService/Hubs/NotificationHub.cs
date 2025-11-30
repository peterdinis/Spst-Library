using Microsoft.AspNetCore.SignalR;

namespace NotificationService.Hubs
{
    public class NotificationHub : Hub
    {
        private static readonly Dictionary<string, string> UserConnections = new();

        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "AuthenticatedUsers");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "AuthenticatedUsers");
            
            var userEntry = UserConnections.FirstOrDefault(x => x.Value == Context.ConnectionId);
            if (userEntry.Key != null)
            {
                UserConnections.Remove(userEntry.Key);
            }
            
            await base.OnDisconnectedAsync(exception);
        }

        public async Task RegisterUser(string userId)
        {
            UserConnections[userId] = Context.ConnectionId;
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            
            Console.WriteLine($"User {userId} registered with connection {Context.ConnectionId}");
        }
        
        public async Task UnregisterUser(string userId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
            UserConnections.Remove(userId);
        }
    }
}