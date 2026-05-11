using anime_backend.Data;
using anime_backend.DTOs.Auth;
using anime_backend.Interfaces;
using anime_backend.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Claims;
using System.Security.Cryptography;

namespace anime_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly AppDbContext _dbContext;
        private readonly EmailService _email;
        private readonly IMemoryCache _cache;

        public AuthController(IAuthService authService, EmailService email, IMemoryCache cache, AppDbContext dbContext)
        {
            _authService = authService;
            _email = email;
            _cache = cache;
            _dbContext = dbContext;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync(RegisterDto dto)
        {
            try
            {
                var user = await _authService.RegisterAsync(dto);

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                };

                var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var principal = new ClaimsPrincipal(identity);

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync(LoginDto dto)
        {
            try
            {
                var user = await _authService.LoginAsync(dto);

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                };

                var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var principal = new ClaimsPrincipal(identity);

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
                });

                return Ok(user);
            }
            catch (Exception ex)
            {
                return Unauthorized(new {message = ex.Message});
            }
            
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMe()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = await _authService.GetUserByIdAsync(int.Parse(userId));
            if (user == null) return NotFound();

            return Ok(user);
        }

        [HttpPost("send-code")]
        public async Task<IActionResult> SendCode([FromBody] SendCodeRequest req)
        {
            var code = RandomNumberGenerator.GetInt32(100000, 999999).ToString();

            _cache.Set(req.Email, code, TimeSpan.FromMinutes(10));

            string html = $@"
                <h2>Ваш код для Aniflex</h2>
                <p style='font-size: 24px; font-weight: bold; color: #333;'>{code}</p>
                <p>Код активации действителен 10 минут.</p>             
                <br><br>
                <p>Если вы не запрашивали код, проигнорируйте сообщение!</p>
            ";

            await _email.SendEmailAsync(
                req.Email,
                "Код подтверждения Aniflex",
                html
            );

            return Ok("Код отправлен!");
        }

        [HttpPost("verify-email")]
        public IActionResult VerifyEmail(VerifyCodeRequest req)
        {
            if (_cache.TryGetValue(req.Email, out string? savedCode) && savedCode == req.Code)
            {
                _cache.Remove(req.Email);
                return Ok("Почта подтверждена!");
            }

            return BadRequest("Неверный код");
        }

        [HttpPost("reset-code")]
        public async Task<IActionResult> SendResetCode(SendCodeRequest req)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null) return Ok("Код отправлен если существует пользователь");

            var code = new Random().Next(100000, 999999).ToString();

            _cache.Set($"reset:{req.Email}", code, TimeSpan.FromMinutes(10));

            string html = $@"
                <h2>Ваш код для восстановления пароля Aniflex</h2>
                <p style='font-size: 24px; font-weight: bold; color: #333;'>{code}</p>
                <p>Код активации действителен 10 минут.</p>             
                <br><br>
                <p>Если вы не запрашивали код, проигнорируйте сообщение!</p>
            ";

            await _email.SendEmailAsync(req.Email, "Восстановление пароля Aniflex", html);
            return Ok("Код восстановления отправлен");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest req)
        {
            if (!_cache.TryGetValue($"reset:{req.Email}", out string? savedCode))
            {
                return BadRequest("Неверный или истекший код подтверждения.");
            }

            if (savedCode != req.Code)
                return BadRequest("Неверный код!");

            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null) return BadRequest("Пользователь не найден");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
            await _dbContext.SaveChangesAsync();

            _cache.Remove($"reset:{req.Email}");

            return Ok("Пароль изменен!");
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { message = "Вы вышли" });
        }
    }

    public record SendCodeRequest(string Email);
    public record VerifyCodeRequest(string Email, string Code);
    public record ResetPasswordRequest(string Email, string Code, string NewPassword);
}
