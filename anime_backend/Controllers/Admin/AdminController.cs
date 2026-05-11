using anime_backend.DTOs.User;
using anime_backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace anime_backend.Controllers.Admin
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;

        public AdminController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("users/get-all")]
        public async Task<List<UserResponseDto>> GetAllUsersAsync()
        {
            return await _userService.GetAllUsersAsync();
        }

        [HttpPost("users/ban/{userId}")]
        public async Task<IActionResult> BlockUserAsync(int userId, BanRequest request)
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var adminName = User.FindFirst(ClaimTypes.Name)?.Value!;

            var user = await _userService.BlockUserAsync(userId, request.IsBlocked, adminId, adminName);
            return NoContent();
        }

        [HttpPost("users/verify/{userId}")]
        public async Task<IActionResult> VerifyUserAsync(int userId, VerifyRequest request)
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var adminName = User.FindFirst(ClaimTypes.Name)?.Value!;

            var user = await _userService.VerifyUserAsync(userId, request.IsVerify, adminId, adminName);
            return NoContent();
        }
    }

    public class BanRequest { public bool IsBlocked { get; set; } }
    public class VerifyRequest { public bool IsVerify { get; set; } }
}
