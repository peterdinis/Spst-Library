namespace BooksService.Dtos;

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateCategoryDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
}