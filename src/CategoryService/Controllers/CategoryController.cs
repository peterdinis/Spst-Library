using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CategoryService.Data;
using CategoryService.Dtos;
using CategoryService.Entities;
using CategoryService.Interfaces;

namespace CategoryService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CategoriesController> _logger;
        private readonly IBookService _bookService;

        public CategoriesController(
            ApplicationDbContext context, 
            ILogger<CategoriesController> logger,
            IBookService bookService)
        {
            _context = context;
            _logger = logger;
            _bookService = bookService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories([FromQuery] bool includeBooks = false)
        {
            _logger.LogInformation("Getting all categories, IncludeBooks: {IncludeBooks}", includeBooks);
            
            var categories = await _context.Categories
                .Select(c => MapToDto(c))
                .ToListAsync();

            if (includeBooks)
            {
                foreach (var category in categories)
                {
                    try
                    {
                        var books = await _bookService.GetBooksByCategoryAsync(category.Id);
                        category.Books = books;
                        category.BooksCount = books.Count;
                    }
                    catch (TimeoutException ex)
                    {
                        _logger.LogWarning(ex, "Timeout while fetching books for category {CategoryId}", category.Id);
                        category.BooksCount = 0;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error while fetching books for category {CategoryId}", category.Id);
                        category.BooksCount = 0;
                    }
                }
            }
            else
            {
                // Still get counts for each category
                foreach (var category in categories)
                {
                    try
                    {
                        category.BooksCount = await _bookService.GetBooksCountByCategoryAsync(category.Id);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to get books count for category {CategoryId}", category.Id);
                        category.BooksCount = 0;
                    }
                }
            }

            _logger.LogInformation("Retrieved {Count} categories", categories.Count);
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id, [FromQuery] bool includeBooks = false)
        {
            _logger.LogInformation("Getting category with ID {CategoryId}, IncludeBooks: {IncludeBooks}", id, includeBooks);

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                _logger.LogWarning("Category with ID {CategoryId} not found", id);
                return NotFound(new { message = "Category not found" });
            }

            var categoryDto = MapToDto(category);

            if (includeBooks)
            {
                try
                {
                    var books = await _bookService.GetBooksByCategoryAsync(id);
                    categoryDto.Books = books;
                    categoryDto.BooksCount = books.Count;
                    _logger.LogInformation("Retrieved {BooksCount} books for category {CategoryId}", books.Count, id);
                }
                catch (TimeoutException ex)
                {
                    _logger.LogWarning(ex, "Book service timeout while fetching books for category {CategoryId}", id);
                    return StatusCode(503, new { message = "Book service is temporarily unavailable" });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error while fetching books for category {CategoryId}", id);
                    return StatusCode(500, new { message = "Error retrieving books information" });
                }
            }
            else
            {
                try
                {
                    categoryDto.BooksCount = await _bookService.GetBooksCountByCategoryAsync(id);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to get books count for category {CategoryId}", id);
                    categoryDto.BooksCount = 0;
                }
            }

            _logger.LogInformation("Category with ID {CategoryId} found: {CategoryTitle}", id, category.Title);
            return Ok(categoryDto);
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

            // Check if category has books before deletion
            try
            {
                var booksCount = await _bookService.GetBooksCountByCategoryAsync(id);
                if (booksCount > 0)
                {
                    _logger.LogWarning("Cannot delete category {CategoryId} with {BooksCount} associated books", id, booksCount);
                    return BadRequest(new { message = $"Cannot delete category with {booksCount} associated books" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Could not verify books count for category {CategoryId}, proceeding with deletion", id);
                // Continue with deletion if we can't verify book count
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