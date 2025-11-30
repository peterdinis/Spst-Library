using IdentityService.Dtos;
using IdentityService.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IdentityService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UsersController(UserManager<ApplicationUser> userManager) : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = _userManager.Users.ToList();
            var userDtos = new List<UserResponseDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userDtos.Add(new UserResponseDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FullName = user.FullName,
                    Roles = [.. roles],
                });
            }

            return Ok(userDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                Email = user.Email!,
                FullName = user.FullName,
                Roles = [.. roles],
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            var result = await _userManager.DeleteAsync(user);
            
            if (result.Succeeded)
                return Ok(new { message = "User deleted successfully" });

            return BadRequest(result.Errors);
        }
    }
}