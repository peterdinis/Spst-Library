using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CategoryService.Entities;
using CategoryService.Dtos;
using CategoryService.Data;

namespace CategoryService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class CategoriesController : ControllerBase
    {
        private readonly ILogger<CategoriesController> _logger;
        private readonly ApplicationDbContext _context;

        public CategoriesController(
            ILogger<CategoriesController> logger,
            ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        /// <summary>
        /// Získa stránkovaný zoznam všetkých kategórií
        /// </summary>
        /// <param name="request">Parametre pre stránkovanie a filtrovanie</param>
        /// <returns>Stránkovaný zoznam kategórií</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PagedResultDto<CategoryDto>>> GetCategories(
            [FromQuery] PagedRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Základný query
                var query = _context.Categories.AsNoTracking().AsQueryable();

                // Aplikovanie filtra podľa SearchTerm
                if (!string.IsNullOrWhiteSpace(request.SearchTerm))
                {
                    var searchTerm = request.SearchTerm.Trim().ToLower();
                    query = query.Where(c => 
                        c.Title.ToLower().Contains(searchTerm) || 
                        c.Description.ToLower().Contains(searchTerm));
                }

                // Získanie celkového počtu pre pagináciu
                var totalCount = await query.CountAsync();

                // Aplikovanie zoradenia
                query = request.SortBy?.ToLower() switch
                {
                    "id" => request.SortDescending 
                        ? query.OrderByDescending(c => c.Id) 
                        : query.OrderBy(c => c.Id),
                    "title" => request.SortDescending 
                        ? query.OrderByDescending(c => c.Title) 
                        : query.OrderBy(c => c.Title),
                    "description" => request.SortDescending 
                        ? query.OrderByDescending(c => c.Description) 
                        : query.OrderBy(c => c.Description),
                    _ => request.SortDescending 
                        ? query.OrderByDescending(c => c.Id) 
                        : query.OrderBy(c => c.Id)
                };

                // Aplikovanie paginácie
                var categories = await query
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync();

                // Manuálne mapovanie na DTO
                var categoryDtos = categories.Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description
                }).ToList();

                var result = new PagedResultDto<CategoryDto>
                {
                    Items = categoryDtos,
                    TotalCount = totalCount,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };

                _logger.LogInformation("Načítaných {Count} kategórií z celkových {TotalCount}", 
                    categoryDtos.Count, totalCount);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Chyba pri načítavaní kategórií");
                return StatusCode(500, "Došlo k chybe pri načítavaní kategórií");
            }
        }

        /// <summary>
        /// Získa konkrétnu kategóriu podľa ID
        /// </summary>
        /// <param name="id">ID kategórie</param>
        /// <returns>Kategória</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID musí byť kladné číslo");
            }

            try
            {
                var category = await _context.Categories
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (category == null)
                {
                    _logger.LogWarning("Kategória s ID {Id} nebola nájdená", id);
                    return NotFound();
                }

                // Manuálne mapovanie na DTO
                var categoryDto = new CategoryDto
                {
                    Id = category.Id,
                    Title = category.Title,
                    Description = category.Description
                };

                return Ok(categoryDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Chyba pri načítavaní kategórie s ID {Id}", id);
                return StatusCode(500, "Došlo k chybe pri načítavaní kategórie");
            }
        }

        /// <summary>
        /// Vytvorí novú kategóriu
        /// </summary>
        /// <param name="createDto">Dáta pre novú kategóriu</param>
        /// <returns>Vytvorená kategória</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Kontrola duplicity názvu
                var existingCategory = await _context.Categories
                    .FirstOrDefaultAsync(c => c.Title.ToLower() == createDto.Title.Trim().ToLower());

                if (existingCategory != null)
                {
                    ModelState.AddModelError(nameof(createDto.Title), "Kategória s týmto názvom už existuje");
                    return BadRequest(ModelState);
                }

                // Manuálne vytvorenie entity z DTO
                var category = new Category
                {
                    Title = createDto.Title.Trim(),
                    Description = createDto.Description.Trim()
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                // Manuálne mapovanie na DTO pre odpoveď
                var categoryDto = new CategoryDto
                {
                    Id = category.Id,
                    Title = category.Title,
                    Description = category.Description
                };

                _logger.LogInformation("Vytvorená nová kategória: {Title} (ID: {Id})", 
                    category.Title, category.Id);

                return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, categoryDto);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Chyba databázy pri vytváraní kategórie");
                return StatusCode(500, "Došlo k chybe pri ukladaní kategórie do databázy");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Chyba pri vytváraní kategórie");
                return StatusCode(500, "Došlo k chybe pri vytváraní kategórie");
            }
        }

        /// <summary>
        /// Aktualizuje existujúcu kategóriu
        /// </summary>
        /// <param name="id">ID kategórie</param>
        /// <param name="updateDto">Nové dáta kategórie</param>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id <= 0)
            {
                return BadRequest("ID musí byť kladné číslo");
            }

            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                {
                    _logger.LogWarning("Kategória s ID {Id} nebola nájdená pre aktualizáciu", id);
                    return NotFound();
                }

                // Kontrola duplicity názvu (okrem aktuálnej kategórie)
                var duplicateCategory = await _context.Categories
                    .FirstOrDefaultAsync(c => 
                        c.Id != id && 
                        c.Title.ToLower() == updateDto.Title.Trim().ToLower());

                if (duplicateCategory != null)
                {
                    ModelState.AddModelError(nameof(updateDto.Title), "Kategória s týmto názvom už existuje");
                    return BadRequest(ModelState);
                }

                // Manuálne aktualizácia entity z DTO
                category.Title = updateDto.Title.Trim();
                category.Description = updateDto.Description.Trim();

                await _context.SaveChangesAsync();

                _logger.LogInformation("Aktualizovaná kategória: {Title} (ID: {Id})", 
                    category.Title, category.Id);

                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Chyba databázy pri aktualizácii kategórie s ID {Id}", id);
                return StatusCode(500, "Došlo k chybe pri aktualizácii kategórie v databáze");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Chyba pri aktualizácii kategórie s ID {Id}", id);
                return StatusCode(500, "Došlo k chybe pri aktualizácii kategórie");
            }
        }

        /// <summary>
        /// Odstráni kategóriu
        /// </summary>
        /// <param name="id">ID kategórie</param>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID musí byť kladné číslo");
            }

            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                {
                    _logger.LogWarning("Kategória s ID {Id} nebola nájdená pre vymazanie", id);
                    return NotFound();
                }

                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Vymazaná kategória: {Title} (ID: {Id})", 
                    category.Title, category.Id);

                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Chyba databázy pri vymazávaní kategórie s ID {Id}", id);
                return StatusCode(500, "Došlo k chybe pri vymazávaní kategórie z databázy");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Chyba pri vymazávaní kategórie s ID {Id}", id);
                return StatusCode(500, "Došlo k chybe pri vymazávaní kategórie");
            }
        }

        /// <summary>
        /// Kontrola existencie kategórie podľa názvu
        /// </summary>
        /// <param name="title">Názov kategórie</param>
        /// <param name="id">ID kategórie (pre aktualizáciu)</param>
        [HttpGet("exists")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> CategoryExists([FromQuery] string title, [FromQuery] int? id = null)
        {
            if (string.IsNullOrWhiteSpace(title))
            {
                return Ok(false);
            }

            var normalizedTitle = title.Trim().ToLower();
            var exists = await _context.Categories
                .AnyAsync(c => 
                    c.Title.ToLower() == normalizedTitle && 
                    (id == null || c.Id != id.Value));

            return Ok(exists);
        }
    }
}