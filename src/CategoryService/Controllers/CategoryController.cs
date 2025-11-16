using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CategoryService.Data;
using CategoryService.Dtos;
using CategoryService.Entities;

namespace CategoryService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CategoriesController> _logger;

        public CategoriesController(ApplicationDbContext context, ILogger<CategoriesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            _logger.LogInformation("Getting all categories");
            
            var categories = await _context.Categories
                .Select(c => MapToDto(c))
                .ToListAsync();

            _logger.LogInformation("Retrieved {Count} categories", categories.Count);
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            _logger.LogInformation("Getting category with ID {CategoryId}", id);

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                _logger.LogWarning("Category with ID {CategoryId} not found", id);
                return NotFound(new { message = "Category not found" });
            }

            _logger.LogInformation("Category with ID {CategoryId} found: {CategoryTitle}", id, category.Title);
            return Ok(MapToDto(category));
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategory(CreateCategoryDto dto)
        {
            _logger.LogInformation("Creating new category with title: {CategoryTitle}", dto.Title);

            var category = new Category
            {
                Title = dto.Title,
                Description = dto.Description
            };

            try
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Category created successfully with ID {CategoryId}", category.Id);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while creating category with title: {CategoryTitle}", dto.Title);
                return StatusCode(500, new { message = "Database error", details = ex.Message });
            }

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, MapToDto(category));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDto dto)
        {
            _logger.LogInformation("Updating category with ID {CategoryId}", id);

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                _logger.LogWarning("Category with ID {CategoryId} not found for update", id);
                return NotFound(new { message = "Category not found" });
            }

            _logger.LogInformation("Updating category from: {OldTitle} to: {NewTitle}", category.Title, dto.Title);

            category.Title = dto.Title;
            category.Description = dto.Description;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Category with ID {CategoryId} updated successfully", id);
            }
            catch (DbUpdateConcurrencyException)
            {
                _logger.LogWarning("Concurrency conflict while updating category with ID {CategoryId}", id);
                return Conflict(new { message = "Category was updated by another process" });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while updating category with ID {CategoryId}", id);
                return StatusCode(500, new { message = "Database error", details = ex.Message });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            _logger.LogInformation("Deleting category with ID {CategoryId}", id);

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                _logger.LogWarning("Category with ID {CategoryId} not found for deletion", id);
                return NotFound(new { message = "Category not found" });
            }

            _logger.LogInformation("Deleting category: {CategoryTitle} (ID: {CategoryId})", category.Title, category.Id);

            _context.Categories.Remove(category);

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Category with ID {CategoryId} deleted successfully", id);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while deleting category with ID {CategoryId}", id);
                return StatusCode(500, new { message = "Database error", details = ex.Message });
            }

            return NoContent();
        }

        private static CategoryDto MapToDto(Category category) => new CategoryDto
        {
            Id = category.Id,
            Title = category.Title,
            Description = category.Description
        };
    }
}