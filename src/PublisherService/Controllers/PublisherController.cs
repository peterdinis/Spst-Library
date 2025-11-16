using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PublisherService.Data;
using PublisherService.Dtos;
using PublisherService.Entities;

namespace PublisherService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PublishersController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PublisherReadDto>>> GetPublishers(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            if (pageNumber <= 0) pageNumber = 1;
            if (pageSize <= 0) pageSize = 10;

            var totalCount = await _context.Publishers.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var publishers = await _context.Publishers
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new PublisherReadDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Address = p.Address,
                    ContactNumber = p.ContactNumber
                })
                .ToListAsync();

            // Pagination info in headers
            Response.Headers.Add("X-Total-Count", totalCount.ToString());
            Response.Headers.Add("X-Total-Pages", totalPages.ToString());
            Response.Headers.Add("X-Page-Number", pageNumber.ToString());
            Response.Headers.Add("X-Page-Size", pageSize.ToString());

            return Ok(publishers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PublisherReadDto>> GetPublisher(int id)
        {
            var publisher = await _context.Publishers.FindAsync(id);
            if (publisher == null) return NotFound();

            var dto = new PublisherReadDto
            {
                Id = publisher.Id,
                Name = publisher.Name,
                Address = publisher.Address ?? string.Empty,
                ContactNumber = publisher.ContactNumber ?? string.Empty
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<PublisherReadDto>> CreatePublisher(PublisherCreateDto dto)
        {
            var publisher = new Publisher
            {
                Name = dto.Name,
                Address = dto.Address,
                ContactNumber = dto.ContactNumber
            };

            _context.Publishers.Add(publisher);
            await _context.SaveChangesAsync();

            var readDto = new PublisherReadDto
            {
                Id = publisher.Id,
                Name = publisher.Name,
                Address = publisher.Address,
                ContactNumber = publisher.ContactNumber
            };

            return CreatedAtAction(nameof(GetPublisher), new { id = publisher.Id }, readDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePublisher(int id, PublisherUpdateDto dto)
        {
            var publisher = await _context.Publishers.FindAsync(id);
            if (publisher == null) return NotFound();

            publisher.Name = dto.Name;
            publisher.Address = dto.Address;
            publisher.ContactNumber = dto.ContactNumber;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePublisher(int id)
        {
            var publisher = await _context.Publishers.FindAsync(id);
            if (publisher == null) return NotFound();

            _context.Publishers.Remove(publisher);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
