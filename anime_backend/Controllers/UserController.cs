using anime_backend.DTOs.User;
using anime_backend.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace anime_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("get-users")]
        public async Task<List<UserResponseDto>> GetAllUsersAsync()
        {
            return await _userService.GetAllUsersAsync();
        }

        [HttpGet("get-user-{id}")]
        public async Task<UserResponseDto> GetUserByIdAsync(int id)
        {
            return await _userService.GetUserByIdAsync(id);
        }

        [HttpGet("get-user-by-name")]
        public async Task<UserResponseDto> GetUserByEmail(string name)
        {
            return await _userService.GetUserByNameAsync(name);
        }

        [HttpPost("create-user")]
        public async Task<IActionResult> CreateUserAsync(CreateUserDto dto)
        {
            var user = await _userService.CreateUserAsync(dto);
            return Ok(user);
        }
    }
}
