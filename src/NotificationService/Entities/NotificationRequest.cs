using System.ComponentModel.DataAnnotations;

namespace NotificationService.Entities
{
    public class NotificationRequest
    {
        [Required(ErrorMessage = "UserId is required")]
        [StringLength(100, ErrorMessage = "UserId cannot be longer than 100 characters")]
        public string UserId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, ErrorMessage = "Title cannot be longer than 200 characters")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Message is required")]
        [StringLength(1000, ErrorMessage = "Message cannot be longer than 1000 characters")]
        public string Message { get; set; } = string.Empty;
    }
}