using System.ComponentModel.DataAnnotations;

namespace PublisherService.Entities;

  public class Publisher
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = null!;

        [MaxLength(250)]
        public string Address { get; set; } = null!;

        [MaxLength(50)]
        public string ContactNumber { get; set; } = null!;
    }
