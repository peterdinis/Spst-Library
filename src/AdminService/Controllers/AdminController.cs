using AdminService.Dtos;
using AdminService.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AdminService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<ApplicationAdmin> _userManager;
        private readonly SignInManager<ApplicationAdmin> _signInManager;

        public AdminController(
            UserManager<ApplicationAdmin> userManager,
            SignInManager<ApplicationAdmin> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new ApplicationAdmin
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName,
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // Assign role
                if (!string.IsNullOrEmpty(model.Role) && 
                    (model.Role == "Admin" || model.Role == "Teacher" || model.Role == "Student"))
                {
                    await _userManager.AddToRoleAsync(user, model.Role);
                }

                return Ok(new { message = "User registered successfully" });
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid credentials" });

            var result = await _signInManager.PasswordSignInAsync(
                user, 
                model.Password, 
                model.RememberMe, 
                lockoutOnFailure: true);

            if (result.Succeeded)
            {
                var roles = await _userManager.GetRolesAsync(user);
                
                return Ok(new UserResponseDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FullName = user.FullName,
                    Roles = [.. roles],
                });
            }

            if (result.IsLockedOut)
                return StatusCode(423, new { message = "Account locked due to multiple failed attempts" });

            return Unauthorized(new { message = "Invalid credentials" });
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet("current-user")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                Email = user.Email!,
                FullName = user.FullName,
                Roles = [.. roles],
            });
        }

        [HttpGet("access-denied")]
        public IActionResult AccessDenied()
        {
            return StatusCode(403, new { message = "Access denied" });
        }
    }
}