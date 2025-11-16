using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BooksService.Data;
using BooksService.Dtos;
using BooksService.Entities;

namespace BooksService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<BooksController> _logger;

        public BooksController(ApplicationDbContext context, ILogger<BooksController> logger)
        {
            _context = context;
            _logger = logger;
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

            var book = new Book
            {
                Title = dto.Title,
                Author = dto.Author,
                Publisher = dto.Publisher,
                Year = dto.Year,
                ISBN = dto.ISBN,
                Pages = dto.Pages,
                Category = dto.Category,
                Language = dto.Language,
                Description = dto.Description,
                PhotoPath = dto.PhotoPath,
                IsAvailable = true,
                AddedToLibrary = DateTime.UtcNow
            };

            try
            {
                _context.Books.Add(book);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Book created successfully with ID {BookId}: {BookTitle}", book.Id, book.Title);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while creating book with title: {BookTitle}", dto.Title);
                return StatusCode(500, new { message = "Database error", details = ex.Message });
            }

            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, MapToDto(book));
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

            _logger.LogInformation("Updating book from: {OldTitle} to: {NewTitle}", book.Title, dto.Title);

            book.Title = dto.Title;
            book.Author = dto.Author;
            book.Publisher = dto.Publisher;
            book.Year = dto.Year;
            book.ISBN = dto.ISBN;
            book.Pages = dto.Pages;
            book.Category = dto.Category;
            book.Language = dto.Language;
            book.Description = dto.Description;
            book.PhotoPath = dto.PhotoPath;
            book.IsAvailable = dto.IsAvailable;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Book with ID {BookId} updated successfully", id);
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

            return NoContent();
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

        private static BookDto MapToDto(Book book) => new BookDto
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author,
            Publisher = book.Publisher,
            Year = book.Year,
            ISBN = book.ISBN,
            Pages = book.Pages,
            Category = book.Category,
            Language = book.Language,
            Description = book.Description,
            PhotoPath = book.PhotoPath,
            IsAvailable = book.IsAvailable,
            AddedToLibrary = book.AddedToLibrary
        };
    }
}