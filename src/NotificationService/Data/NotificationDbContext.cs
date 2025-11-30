using Microsoft.EntityFrameworkCore;
using NotificationService.Entities;

namespace NotificationService.Data
{
    public class NotificationDbContext(DbContextOptions<NotificationDbContext> options) : DbContext(options)
    {
        public DbSet<Notification> Notifications => Set<Notification>();

        public DbSet<NotificationRequest> NotificationRequests => Set<NotificationRequest>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.CreatedAt);
                
                entity.Property(e => e.Id)
                    .HasMaxLength(36);
                
                entity.Property(e => e.Title)
                    .HasMaxLength(200)
                    .IsRequired();
                
                entity.Property(e => e.Message)
                    .HasMaxLength(1000)
                    .IsRequired();
                
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
            });
        }
    }
}