using Microsoft.EntityFrameworkCore;
using PublisherService.Entities;

namespace PublisherService.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Publisher> Publishers { get; set; }
}