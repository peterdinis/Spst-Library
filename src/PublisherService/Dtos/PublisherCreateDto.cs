namespace PublisherService.Dtos
{
    public class PublisherCreateDto
    {
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string ContactNumber { get; set; } = null!;

        public string Website {get; set;} = null!;

        public string Email {get; set;} = null!;
    }
}
