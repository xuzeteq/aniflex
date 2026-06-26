using anime_backend.Data;
using anime_backend.DTOs.Auth;
using anime_backend.Interfaces;
using anime_backend.Migrations;
using anime_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace anime_backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _dbContext;

        public AuthService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<UserDto> LoginAsync(LoginDto dto)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Username == dto.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new Exception("Логин или пароль неверные!");

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                FavouritesCount = user.FavouritesCount,
                AvatarUrl = user.AvatarUrl,
                IsBlocked = user.IsBlocked,
                IsVerify = user.IsVerify,
                IsSubscriber = user.IsSubscriber,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserDto> RegisterAsync(RegisterDto dto)
        {
            if (await _dbContext.Users.AnyAsync(u => u.Email == dto.Email))
                throw new Exception("Email уже занят");

            if (await _dbContext.Users.AnyAsync(u => u.Username == dto.Username))
                throw new Exception("Имя пользователя уже занято");

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                IsBlocked = false,
                FavouritesCount = 0,
                IsVerify = false,
                IsSubscriber = false,
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };

            user.AvatarUrl = $"https://ui-avatars.com/api/?name={user?.Username}&background=064e3b&color=22c55e";

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                AvatarUrl = user.AvatarUrl,
                FavouritesCount = user.FavouritesCount,
                IsBlocked = user.IsBlocked,
                IsVerify = user.IsVerify,
                IsSubscriber = user.IsSubscriber,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserDto> GetUserByIdAsync(int id)
        {
            var user = await _dbContext.Users.FindAsync(id);
            if (user == null) throw new Exception("Error");

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                FavouritesCount = user.FavouritesCount,
                AvatarUrl = user.AvatarUrl,
                IsBlocked = user.IsBlocked,
                IsSubscriber = user.IsSubscriber,
                IsVerify = user.IsVerify,
                CreatedAt = user.CreatedAt
            };
        }
    }
}