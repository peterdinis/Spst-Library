namespace CategoryService.Dtos;

public class CategoryDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
}