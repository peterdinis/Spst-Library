using System.ComponentModel.DataAnnotations;

namespace PublisherService.Entities
{
    public class Publisher
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = null!;

        [MaxLength(250)]
        public string? Address { get; set; } 

        [MaxLength(50)]
        public string? ContactNumber { get; set; }

        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(200)]
        public string? Website { get; set; } 
    }
}
