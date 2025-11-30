using NotificationService.Entities;

namespace NotificationService.Interfaces
{
    public interface INotificationService
    {
        Task<Notification> AddAsync(Notification notification);
        Task<Notification> GetByIdAsync(string id);
        Task<List<Notification>> GetByUserIdAsync(string userId);
        Task<List<Notification>> GetUnreadByUserIdAsync(string userId);
        Task<Notification> UpdateAsync(Notification notification);
        Task<bool> DeleteAsync(string id);
        Task<int> GetUnreadCountAsync(string userId);
        Task<List<Notification>> GetRecentByUserIdAsync(string userId, int count = 50);
        Task<bool> MarkAllAsReadAsync(string userId);
        Task CleanupOldNotificationsAsync(DateTime cutoffDate);
    }
}