using BooksService.Dtos;

namespace BooksService.Interfaces;

public interface ICategoryService
{
    Task<bool> CategoryExistsAsync(int categoryId);
    Task<CategoryDto> GetCategoryAsync(int categoryId);
    Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto);
}
