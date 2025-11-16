using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using AuthorService.Data;
using AuthorService.Dtos;
using AuthorService.Entities;

namespace AuthorService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AuthorsController> _logger;
        private readonly IValidator<CreateAuthorDto> _createValidator;
        private readonly IValidator<UpdateAuthorDto> _updateValidator;

        public AuthorsController(
            ApplicationDbContext context, 
            ILogger<AuthorsController> logger,
            IValidator<CreateAuthorDto> createValidator,
            IValidator<UpdateAuthorDto> updateValidator)
        {
            _context = context;
            _logger = logger;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuthorDto>>> GetAuthors()
        {
            _logger.LogInformation("Getting all authors");
            
            var authors = await _context.Authors
                .Select(a => MapToDto(a))
                .ToListAsync();

            _logger.LogInformation("Retrieved {Count} authors", authors.Count);
            return Ok(authors);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AuthorDto>> GetAuthor(int id)
        {
            _logger.LogInformation("Getting author with ID {AuthorId}", id);

            var author = await _context.Authors.FindAsync(id);
            if (author == null)
            {
                _logger.LogWarning("Author with ID {AuthorId} not found", id);
                return NotFound(new { message = "Author not found" });
            }

            _logger.LogInformation("Author with ID {AuthorId} found: {AuthorName}", id, $"{author.FirstName} {author.LastName}");
            return Ok(MapToDto(author));
        }

        [HttpPost]
        public async Task<ActionResult<AuthorDto>> CreateAuthor(CreateAuthorDto dto)
        {
            // Validate using FluentValidation
            var validationResult = await _createValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for creating author: {Errors}", 
                    string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)));
                return BadRequest(new { errors = validationResult.Errors.Select(e => e.ErrorMessage) });
            }

            _logger.LogInformation("Creating new author: {FirstName} {LastName}", dto.FirstName, dto.LastName);

            var author = new Author
            {
                FirstName = dto.FirstName.Trim(),
                LastName = dto.LastName.Trim(),
                Biography = dto.Biography?.Trim() ?? null!,
                Email = dto.Email.Trim(),
                DateOfBirth = dto.DateOfBirth,
                DateOfDeath = dto.DateOfDeath,
                Country = dto.Country.Trim(),
                Website = dto.Website?.Trim() ?? null!,
                IsActive = true,
                CreatedDate = DateTime.UtcNow,
                LastModified = DateTime.UtcNow
            };

            try
            {
                _context.Authors.Add(author);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Author created successfully with ID {AuthorId}: {FirstName} {LastName}", 
                    author.AuthorId, author.FirstName, author.LastName);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while creating author: {FirstName} {LastName}", 
                    dto.FirstName, dto.LastName);
                return StatusCode(500, new { message = "Database error", details = ex.Message });
            }

            return CreatedAtAction(nameof(GetAuthor), new { id = author.AuthorId }, MapToDto(author));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuthor(int id, UpdateAuthorDto dto)
        {
            // Validate using FluentValidation
            var validationResult = await _updateValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for updating author with ID {AuthorId}: {Errors}", 
                    id, string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)));
                return BadRequest(new { errors = validationResult.Errors.Select(e => e.ErrorMessage) });
            }

            if (id != dto.AuthorId)
            {
                _logger.LogWarning("ID mismatch in URL ({UrlId}) and body ({BodyId})", id, dto.AuthorId);
                return BadRequest(new { message = "ID in URL does not match ID in body" });
            }

            _logger.LogInformation("Updating author with ID {AuthorId}", id);

            var author = await _context.Authors.FindAsync(id);
            if (author == null)
            {
                _logger.LogWarning("Author with ID {AuthorId} not found for update", id);
                return NotFound(new { message = "Author not found" });
            }

            _logger.LogInformation("Updating author from: {OldFirstName} {OldLastName} to: {NewFirstName} {NewLastName}", 
                author.FirstName, author.LastName, dto.FirstName, dto.LastName);

            // Update properties
            author.FirstName = dto.FirstName.Trim();
            author.LastName = dto.LastName.Trim();
            author.Biography = dto.Biography?.Trim() ?? null!;
            author.Email = dto.Email.Trim();
            author.DateOfBirth = dto.DateOfBirth;
            author.DateOfDeath = dto.DateOfDeath;
            author.Country = dto.Country.Trim();
            author.Website = dto.Website?.Trim() ?? null!;
            author.IsActive = dto.IsActive;
            author.LastModified = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Author with ID {AuthorId} updated successfully", id);
            }
            catch (DbUpdateConcurrencyException)
            {
                _logger.LogWarning("Concurrency conflict while updating author with ID {AuthorId}", id);
                return Conflict(new { message = "Author was updated by another process" });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while updating author with ID {AuthorId}", id);
                return StatusCode(500, new { message = "Database error", details = ex.Message });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            _logger.LogInformation("Deleting author with ID {AuthorId}", id);

            var author = await _context.Authors.FindAsync(id);
            if (author == null)
            {
                _logger.LogWarning("Author with ID {AuthorId} not found for deletion", id);
                return NotFound(new { message = "Author not found" });
            }

            _logger.LogInformation("Deleting author: {FirstName} {LastName} (ID: {AuthorId})", 
                author.FirstName, author.LastName, author.AuthorId);

            _context.Authors.Remove(author);

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Author with ID {AuthorId} deleted successfully", id);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while deleting author with ID {AuthorId}", id);
                return StatusCode(500, new { message = "Database error", details = ex.Message });
            }

            return NoContent();
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<AuthorDto>>> SearchAuthors([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new { message = "Search term is required" });
            }

            _logger.LogInformation("Searching authors with term: {SearchTerm}", name);

            var authors = await _context.Authors
                .Where(a => a.FirstName.Contains(name) || a.LastName.Contains(name) || (a.FirstName + " " + a.LastName).Contains(name))
                .Select(a => MapToDto(a))
                .ToListAsync();

            _logger.LogInformation("Found {Count} authors matching search term: {SearchTerm}", authors.Count, name);
            return Ok(authors);
        }

        private static AuthorDto MapToDto(Author author) => new AuthorDto
        {
            AuthorId = author.AuthorId,
            FirstName = author.FirstName,
            LastName = author.LastName,
            Biography = author.Biography,
            Email = author.Email,
            DateOfBirth = author.DateOfBirth,
            DateOfDeath = author.DateOfDeath,
            Country = author.Country,
            Website = author.Website,
            IsActive = author.IsActive,
            CreatedDate = author.CreatedDate,
            LastModified = author.LastModified
        };
    }
}