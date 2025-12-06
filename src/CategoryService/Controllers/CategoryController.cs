using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CategoryService.Data;
using CategoryService.Dtos;
using CategoryService.Entities;
using CategoryService.Interfaces;
using Polly;
using Polly.Timeout;
using Polly.Retry;
using Polly.CircuitBreaker;

namespace CategoryService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CategoriesController> _logger;
        private readonly IBookService _bookService;
        private readonly IAsyncPolicy _resiliencePolicy;

        public CategoriesController(
            ApplicationDbContext context,
            ILogger<CategoriesController> logger,
            IBookService bookService)
        {
            _context = context;
            _logger = logger;
            _bookService = bookService;
            _resiliencePolicy = CreateResiliencePolicy();
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
                        var books = await _resiliencePolicy.ExecuteAsync(async () =>
                            await _bookService.GetBooksByCategoryAsync(category.Id));

                        category.Books = books;
                        category.BooksCount = books.Count;
                    }
                    catch (TimeoutRejectedException ex)
                    {
                        _logger.LogWarning(ex, "Timeout while fetching books for category {CategoryId}", category.Id);
                        category.BooksCount = 0;
                        category.Books = [];
                    }
                    catch (BrokenCircuitException ex)
                    {
                        _logger.LogWarning(ex, "Circuit breaker open while fetching books for category {CategoryId}", category.Id);
                        category.BooksCount = 0;
                        category.Books = [];
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error while fetching books for category {CategoryId}", category.Id);
                        category.BooksCount = 0;
                        category.Books = [];
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
                        category.BooksCount = await _resiliencePolicy.ExecuteAsync(async () =>
                            await _bookService.GetBooksCountByCategoryAsync(category.Id));
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
                    var books = await _resiliencePolicy.ExecuteAsync(async () =>
                        await _bookService.GetBooksByCategoryAsync(id));

                    categoryDto.Books = books;
                    categoryDto.BooksCount = books.Count;
                    _logger.LogInformation("Retrieved {BooksCount} books for category {CategoryId}", books.Count, id);
                }
                catch (TimeoutRejectedException ex)
                {
                    _logger.LogWarning(ex, "Book service timeout while fetching books for category {CategoryId}", id);
                    return StatusCode(503, new
                    {
                        message = "Book service is temporarily unavailable",
                        category = categoryDto
                    });
                }
                catch (BrokenCircuitException ex)
                {
                    _logger.LogWarning(ex, "Circuit breaker open for book service while fetching books for category {CategoryId}", id);
                    return StatusCode(503, new
                    {
                        message = "Book service is currently unavailable. Please try again later.",
                        category = categoryDto
                    });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error while fetching books for category {CategoryId}", id);
                    return StatusCode(500, new
                    {
                        message = "Error retrieving books information",
                        category = categoryDto
                    });
                }
            }
            else
            {
                try
                {
                    categoryDto.BooksCount = await _resiliencePolicy.ExecuteAsync(async () =>
                        await _bookService.GetBooksCountByCategoryAsync(id));
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
                var booksCount = await _resiliencePolicy.ExecuteAsync(async () =>
                    await _bookService.GetBooksCountByCategoryAsync(id));

                if (booksCount > 0)
                {
                    _logger.LogWarning("Cannot delete category {CategoryId} with {BooksCount} associated books", id, booksCount);
                    return BadRequest(new { message = $"Cannot delete category with {booksCount} associated books" });
                }
            }
            catch (TimeoutRejectedException ex)
            {
                _logger.LogWarning(ex, "Timeout while verifying books count for category {CategoryId}", id);
                return StatusCode(503, new { message = "Cannot verify book service availability. Deletion postponed." });
            }
            catch (BrokenCircuitException ex)
            {
                _logger.LogWarning(ex, "Circuit breaker open while verifying books count for category {CategoryId}", id);
                return StatusCode(503, new { message = "Book service is unavailable. Please try again later." });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Could not verify books count for category {CategoryId}, proceeding with deletion", id);
                // Continue with deletion if we can't verify book count, but log as warning
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

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> SearchCategories(
    [FromQuery] string? keyword,
    [FromQuery] bool includeBooks = false,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20)
        {
            _logger.LogInformation("Searching categories with keyword: {Keyword}, Page: {Page}, PageSize: {PageSize}",
                keyword, page, pageSize);

            // Validácia parametrov
            if (page < 1)
                page = 1;

            if (pageSize < 1 || pageSize > 100)
                pageSize = 20;

            // Vytvorenie základného query
            var query = _context.Categories.AsQueryable();

            // Aplikovanie filtra podľa keyword
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var searchTerm = keyword.ToLower().Trim();
                query = query.Where(c =>
                    c.Title.ToLower().Contains(searchTerm) ||
                    (c.Description != null && c.Description.ToLower().Contains(searchTerm)));
            }

            // Výpočet celkového počtu záznamov pre pagination
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            // Aplikovanie pagination
            var categories = await query
                .OrderBy(c => c.Title)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => MapToDto(c))
                .ToListAsync();

            // Načítanie kníh pre kategórie ak je to potrebné
            if (includeBooks)
            {
                foreach (var category in categories)
                {
                    try
                    {
                        var books = await _resiliencePolicy.ExecuteAsync(async () =>
                            await _bookService.GetBooksByCategoryAsync(category.Id));

                        category.Books = books;
                        category.BooksCount = books.Count;
                    }
                    catch (TimeoutRejectedException ex)
                    {
                        _logger.LogWarning(ex, "Timeout while fetching books for category {CategoryId}", category.Id);
                        category.BooksCount = 0;
                        category.Books = [];
                    }
                    catch (BrokenCircuitException ex)
                    {
                        _logger.LogWarning(ex, "Circuit breaker open while fetching books for category {CategoryId}", category.Id);
                        category.BooksCount = 0;
                        category.Books = [];
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error while fetching books for category {CategoryId}", category.Id);
                        category.BooksCount = 0;
                        category.Books = [];
                    }
                }
            }
            else
            {
                // Načítanie počtu kníh pre kategórie
                foreach (var category in categories)
                {
                    try
                    {
                        category.BooksCount = await _resiliencePolicy.ExecuteAsync(async () =>
                            await _bookService.GetBooksCountByCategoryAsync(category.Id));
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to get books count for category {CategoryId}", category.Id);
                        category.BooksCount = 0;
                    }
                }
            }

            // Vytvorenie pagination response
            var paginationMetadata = new
            {
                totalCount,
                totalPages,
                currentPage = page,
                pageSize,
                hasPrevious = page > 1,
                hasNext = page < totalPages
            };

            Response.Headers.Add("X-Pagination", System.Text.Json.JsonSerializer.Serialize(paginationMetadata));

            _logger.LogInformation("Search completed. Found {Count} categories on page {Page}", categories.Count, page);

            return Ok(new
            {
                categories,
                pagination = paginationMetadata
            });
        }

        private static CategoryDto MapToDto(Category category) => new CategoryDto
        {
            Id = category.Id,
            Title = category.Title,
            Description = category.Description
        };

        private IAsyncPolicy CreateResiliencePolicy()
        {
            // Retry policy: 2 pokusy s exponenciálnym backoff-om (pre kategórie môžeme byť menej agresívni)
            var retryPolicy = Policy
                .Handle<Exception>(ex => ex is not BrokenCircuitException)
                .WaitAndRetryAsync(
                    retryCount: 2,
                    sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(1.5, retryAttempt)),
                    onRetry: (exception, timeSpan, retryCount, context) =>
                    {
                        _logger.LogWarning(
                            "Retry {RetryCount} after {TimeSpan} due to: {ExceptionMessage}",
                            retryCount, timeSpan, exception.Message);
                    });

            // Timeout policy: 3 sekundy timeout (pre zoznamy kníh môže byť dlhší)
            var timeoutPolicy = Policy.TimeoutAsync(
                timeout: TimeSpan.FromSeconds(3),
                timeoutStrategy: TimeoutStrategy.Pessimistic,
                onTimeoutAsync: (context, timeSpan, task) =>
                {
                    _logger.LogWarning("Timeout after {TimeSpan} for book service operation", timeSpan);
                    return Task.CompletedTask;
                });

            // Circuit breaker: otvorí sa po 3 zlyhaniach za 20 sekúnd
            var circuitBreakerPolicy = Policy
                .Handle<Exception>()
                .CircuitBreakerAsync(
                    exceptionsAllowedBeforeBreaking: 3,
                    durationOfBreak: TimeSpan.FromSeconds(20),
                    onBreak: (exception, duration) =>
                    {
                        _logger.LogWarning(
                            "Circuit breaker opened for book service for {Duration} due to: {ExceptionType}",
                            duration, exception.GetType().Name);
                    },
                    onReset: () =>
                    {
                        _logger.LogInformation("Circuit breaker for book service reset");
                    },
                    onHalfOpen: () =>
                    {
                        _logger.LogInformation("Circuit breaker for book service half-open");
                    });

            // Fallback policy pre zoznam kategórií
            var fallbackPolicy = Policy<object>
                .Handle<Exception>();

            // Kombinácia politík pre jednotlivé operácie
            return Policy.WrapAsync(timeoutPolicy, circuitBreakerPolicy, retryPolicy);
        }
    }
}