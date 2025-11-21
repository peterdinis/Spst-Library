using BooksService.Interfaces;
using BooksService.Dtos;

namespace BooksService.Services;


public class CategoryService : ICategoryService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<CategoryService> _logger;

    public CategoryService(HttpClient httpClient, ILogger<CategoryService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<bool> CategoryExistsAsync(int categoryId)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/api/categories/{categoryId}/exists");
            return response.IsSuccessStatusCode;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Error checking if category {CategoryId} exists", categoryId);
            return false;
        }
    }

    public async Task<CategoryDto> GetCategoryAsync(int categoryId)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/api/categories/{categoryId}");
            
            if (!response.IsSuccessStatusCode)
                return null;

            return await response.Content.ReadFromJsonAsync<CategoryDto>();
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Error getting category {CategoryId}", categoryId);
            return null;
        }
    }

    public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync("/api/categories", dto);
            
            if (!response.IsSuccessStatusCode)
                return null;

            return await response.Content.ReadFromJsonAsync<CategoryDto>();
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Error creating category {CategoryName}", dto.Name);
            return null;
        }
    }
}