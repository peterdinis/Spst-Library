using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using NotificationService.Data;
using NotificationService.Entities;
using NotificationService.Hubs;
using NotificationService.Models;

namespace NotificationService.Services
{
    public class NotificationService : INotificationService
    {
        private readonly NotificationDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(
            NotificationDbContext context,
            IHubContext<NotificationHub> hubContext,
            ILogger<NotificationService> logger)
        {
            _context = context;
            _hubContext = hubContext;
            _logger = logger;
        }

        public async Task<Notification> CreateNotificationAsync(NotificationRequest request)
        {
            // Validácia
            if (string.IsNullOrWhiteSpace(request.UserId))
                throw new ArgumentException("UserId is required");

            if (string.IsNullOrWhiteSpace(request.Title))
                throw new ArgumentException("Title is required");

            var notification = new Notification
            {
                Title = request.Title.Trim(),
                Message = request.Message?.Trim() ?? string.Empty,
            };

            // Uložiť do DB
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // Real-time notifikácia cez SignalR
            await SendRealTimeNotification(notification);

            _logger.LogInformation("Notification created: {NotificationId} for user {UserId}", 
                notification.Id, request.UserId);

            return notification;
        }

        private async Task SendRealTimeNotification(Notification notification)
        {
            try
            {
                await _hubContext.Clients.Group($"user_{notification.UserId}")
                    .SendAsync("ReceiveNotification", new
                    {
                        notification.Id,
                        notification.UserId,
                        notification.Title,
                        notification.Message,
                        notification.Type,
                        notification.CreatedAt,
                        notification.IsRead,
                        notification.ImageUrl,
                        notification.ActionUrl
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending real-time notification {NotificationId}", notification.Id);
            }
        }

        public async Task<Notification?> GetNotificationByIdAsync(string id)
        {
            return await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && !n.IsArchived);
        }

        public async Task<List<Notification>> GetUserNotificationsAsync(string userId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsArchived)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Notification>> GetUserUnreadNotificationsAsync(string userId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead && !n.IsArchived)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Notification>> GetRecentNotificationsAsync(int count)
        {
            return await _context.Notifications
                .Where(n => !n.IsArchived)
                .OrderByDescending(n => n.CreatedAt)
                .Take(count)
                .ToListAsync();
        }

        public async Task<bool> MarkAsReadAsync(string notificationId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId && !n.IsArchived);
                
            if (notification == null) return false;

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            // Notifikovať klienta o zmene
            await _hubContext.Clients.Group($"user_{notification.UserId}")
                .SendAsync("NotificationRead", notificationId);

            return true;
        }

        public async Task<bool> MarkAllAsReadAsync(string userId)
        {
            var unreadNotifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead && !n.IsArchived)
                .ToListAsync();

            foreach (var notification in unreadNotifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync();
            return unreadNotifications.Count > 0;
        }

        public async Task<bool> DeleteNotificationAsync(string notificationId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId && !n.IsArchived);
                
            if (notification == null) return false;

            // Soft delete
            notification.IsArchived = true;
            await _context.SaveChangesAsync();
            
            return true;
        }

        public async Task<NotificationStats> GetUserNotificationStatsAsync(string userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsArchived)
                .ToListAsync();

            var unreadCount = await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead && !n.IsArchived);

            var lastNotification = notifications.OrderByDescending(n => n.CreatedAt).FirstOrDefault();

            return new NotificationStats
            {
                TotalCount = notifications.Count,
                UnreadCount = unreadCount,
                ReadRate = notifications.Count > 0 ? (notifications.Count - unreadCount) / (double)notifications.Count : 0,
                LastNotificationDate = lastNotification?.CreatedAt
            };
        }

        public async Task<bool> SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                _logger.LogInformation("Simulating email send to: {To}, Subject: {Subject}", to, subject);
                await Task.Delay(100);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending email to {To}", to);
                return false;
            }
        }

        public async Task<bool> SendSmsAsync(string phoneNumber, string message)
        {
            try
            {
                _logger.LogInformation("Simulating SMS send to: {PhoneNumber}, Message: {Message}", phoneNumber, message);
                await Task.Delay(100);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending SMS to {PhoneNumber}", phoneNumber);
                return false;
            }
        }

        // Pomocná metóda pre údržbu - odstrániť staré notifikácie
        public async Task CleanupOldNotificationsAsync(DateTime cutoffDate)
        {
            var oldNotifications = await _context.Notifications
                .Where(n => n.CreatedAt < cutoffDate && n.IsRead && !n.IsArchived)
                .ToListAsync();

            foreach (var notification in oldNotifications)
            {
                notification.IsArchived = true;
            }

            await _context.SaveChangesAsync();
        }
    }
}