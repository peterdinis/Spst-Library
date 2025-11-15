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

        public BooksController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks()
        {
            var books = await _context.Books
                .Select(b => MapToDto(b))
                .ToListAsync();

            return Ok(books);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return NotFound(new { message = "Book not found" });

            return Ok(MapToDto(book));
        }

        [HttpPost]
        public async Task<ActionResult<BookDto>> CreateBook(CreateBookDto dto)
        {
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
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = "Database error", details = ex.Message });
            }

            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, MapToDto(book));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, UpdateBookDto dto)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return NotFound(new { message = "Book not found" });

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
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict(new { message = "Book was updated by another process" });
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = "Database error", details = ex.Message });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return NotFound(new { message = "Book not found" });

            _context.Books.Remove(book);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
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
