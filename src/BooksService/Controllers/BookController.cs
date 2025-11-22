using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BooksService.Data;
using BooksService.Dtos;
using BooksService.Entities;
using BooksService.Interfaces;

namespace BooksService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<BooksController> _logger;
        private readonly IRabbitMQService _rabbitMQService;

        public BooksController(
            ApplicationDbContext context, 
            ILogger<BooksController> logger, 
            IRabbitMQService rabbitMQService)
        {
            _context = context;
            _logger = logger;
            _rabbitMQService = rabbitMQService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks()
        {
            _logger.LogInformation("Getting all books");

            var books = await _context.Books
                .Select(b => MapToDto(b))
                .ToListAsync();

            _logger.LogInformation("Retrieved {Count} books", books.Count);
            return Ok(books);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            _logger.LogInformation("Getting book with ID {BookId}", id);

            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                _logger.LogWarning("Book with ID {BookId} not found", id);
                return NotFound(new { message = "Book not found" });
            }

            _logger.LogInformation("Book with ID {BookId} found: {BookTitle}", id, book.Title);
            return Ok(MapToDto(book));
        }

        [HttpPost]
        public async Task<ActionResult<BookDto>> CreateBook(CreateBookDto dto)
        {
            _logger.LogInformation("Creating new book with title: {BookTitle}", dto.Title);

            try
            {
                // Check if category exists in CategoryService using RabbitMQ
                var categoryResponse = await _rabbitMQService.GetCategoryAsync(dto.CategoryId);
                
                if (!categoryResponse.Exists)
                {
                    _logger.LogWarning("Category with ID {CategoryId} does not exist", dto.CategoryId);
                    return BadRequest(new { message = $"Category with ID {dto.CategoryId} does not exist" });
                }

                var book = new Book
                {
                    Title = dto.Title,
                    Author = dto.Author,
                    Publisher = dto.Publisher,
                    Year = dto.Year,
                    ISBN = dto.ISBN,
                    Pages = dto.Pages,
                    CategoryId = dto.CategoryId,
                    Language = dto.Language,
                    Description = dto.Description,
                    PhotoPath = dto.PhotoPath,
                    IsAvailable = true,
                    AddedToLibrary = DateTime.UtcNow
                };

                _context.Books.Add(book);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Book created successfully with ID {BookId}: {BookTitle}", book.Id, book.Title);

                return CreatedAtAction(nameof(GetBook), new { id = book.Id }, MapToDto(book));
            }
            catch (TimeoutException ex)
            {
                _logger.LogWarning(ex, "Category service timeout while creating book");
                return StatusCode(503, new { message = "Category service is temporarily unavailable" });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while creating book with title: {BookTitle}", dto.Title);
                return StatusCode(500, new { message = "Database error", details = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while creating book with title: {BookTitle}", dto.Title);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, UpdateBookDto dto)
        {
            _logger.LogInformation("Updating book with ID {BookId}", id);

            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                _logger.LogWarning("Book with ID {BookId} not found for update", id);
                return NotFound(new { message = "Book not found" });
            }

            try
            {
                // Check if category exists when CategoryId is being updated
                if (book.CategoryId != dto.CategoryId)
                {
                    var categoryResponse = await _rabbitMQService.GetCategoryAsync(dto.CategoryId);
                    
                    if (!categoryResponse.Exists)
                    {
                        _logger.LogWarning("Category with ID {CategoryId} does not exist", dto.CategoryId);
                        return BadRequest(new { message = $"Category with ID {dto.CategoryId} does not exist" });
                    }
                }

                _logger.LogInformation("Updating book from: {OldTitle} to: {NewTitle}", book.Title, dto.Title);

                book.Title = dto.Title;
                book.Author = dto.Author;
                book.Publisher = dto.Publisher;
                book.Year = dto.Year;
                book.ISBN = dto.ISBN;
                book.Pages = dto.Pages;
                book.CategoryId = dto.CategoryId;
                book.Language = dto.Language;
                book.Description = dto.Description;
                book.PhotoPath = dto.PhotoPath;
                book.IsAvailable = dto.IsAvailable;

                await _context.SaveChangesAsync();
                _logger.LogInformation("Book with ID {BookId} updated successfully", id);

                return NoContent();
            }
            catch (TimeoutException ex)
            {
                _logger.LogWarning(ex, "Category service timeout while updating book with ID {BookId}", id);
                return StatusCode(503, new { message = "Category service is temporarily unavailable" });
            }
            catch (DbUpdateConcurrencyException)
            {
                _logger.LogWarning("Concurrency conflict while updating book with ID {BookId}", id);
                return Conflict(new { message = "Book was updated by another process" });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while updating book with ID {BookId}", id);
                return StatusCode(500, new { message = "Database error", details = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while updating book with ID {BookId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            _logger.LogInformation("Deleting book with ID {BookId}", id);

            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                _logger.LogWarning("Book with ID {BookId} not found for deletion", id);
                return NotFound(new { message = "Book not found" });
            }

            _logger.LogInformation("Deleting book: {BookTitle} by {BookAuthor} (ID: {BookId})",
                book.Title, book.Author, book.Id);

            _context.Books.Remove(book);

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Book with ID {BookId} deleted successfully", id);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while deleting book with ID {BookId}", id);
                return StatusCode(500, new { message = "Database error", details = ex.Message });
            }

            return NoContent();
        }

        private static BookDto MapToDto(Book book) => new()
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author,
            Publisher = book.Publisher,
            Year = book.Year,
            ISBN = book.ISBN,
            Pages = book.Pages,
            CategoryId = book.CategoryId,
            Category = book.Category,
            Language = book.Language,
            Description = book.Description,
            PhotoPath = book.PhotoPath,
            IsAvailable = book.IsAvailable,
            AddedToLibrary = book.AddedToLibrary
        };
    }
}