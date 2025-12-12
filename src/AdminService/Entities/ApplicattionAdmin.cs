using Microsoft.AspNetCore.Identity;

namespace AdminService.Entities
{
    public class ApplicationAdmin : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string AdminCode {get; set;} = string.Empty;
    }
}