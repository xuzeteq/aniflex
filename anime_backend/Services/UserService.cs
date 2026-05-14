using anime_backend.Data;
using anime_backend.DTOs.User;
using anime_backend.Interfaces;
using anime_backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Xml;

namespace anime_backend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _dbContext;
        private readonly ILogger<UserService> _logger;

        public UserService(AppDbContext dbContext, ILogger<UserService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<List<UserResponseDto>> GetAllUsersAsync()
        {
            return await _dbContext.Users.Select(u => new UserResponseDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                FavouritesCount = u.FavouritesCount,
                RatingsCount = u.RatingsCount,
                AvatarUrl = u.AvatarUrl,
                IsVerify = u.IsVerify,
                IsBlocked = u.IsBlocked,
                Role = u.Role,
                CreatedAt = u.CreatedAt
            }).ToListAsync();
        }

        public async Task<UserResponseDto> GetUserByIdAsync(int id)
        {
            var user = await _dbContext.Users.FindAsync(id);

            if (user == null)
                throw new Exception("User not found");

            return new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                AvatarUrl = user.AvatarUrl,
                FavouritesCount = user.FavouritesCount,
                RatingsCount = user.RatingsCount,
                IsVerify = user.IsVerify,
                IsBlocked = user.IsBlocked,
                Role = user.Role,
                CreatedAt= user.CreatedAt
            };
        }

        public async Task<UserResponseDto> GetUserByNameAsync(string name)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == name);

            if (user == null)
                throw new Exception("User not found");

            return new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                AvatarUrl = user.AvatarUrl,
                FavouritesCount = user.FavouritesCount,
                RatingsCount = user.RatingsCount,
                IsVerify = user.IsVerify,
                IsBlocked = user.IsBlocked,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserResponseDto> CreateUserAsync(CreateUserDto dto)
        {
            var existingUserEmail = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            var existingUserUsername = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);

            if (existingUserEmail != null)
                throw new Exception("User already Exist!");

            if (existingUserUsername != null)
                throw new Exception("User already Exist!");

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                AvatarUrl = dto.AvatarUrl,
                FavouritesCount = 0,
                RatingsCount = 0,
                PasswordHash = passwordHash,
                IsBlocked = false,
                IsVerify = false,
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FavouritesCount = user.FavouritesCount,
                RatingsCount = user.RatingsCount,
                AvatarUrl = user.AvatarUrl,
                IsVerify = user.IsVerify,
                IsBlocked = user.IsBlocked,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<bool> BlockUserAsync(int userId, bool isBlocked, int adminId, string adminUsername)
        {
            var user = await _dbContext.Users.FindAsync(userId);

            if (user == null)
            {
                return false;
            }

            user.IsBlocked = isBlocked;

            var audit = new AuditLog
            {
                AdminId = adminId,
                AdminUsername = adminUsername,
                TargetUserId = userId,
                Action = isBlocked ? "заблокировал" : "разблокировал",
                TargetUsername = user.Username,
                CreatedAt = DateTime.UtcNow,
            };

            _dbContext.AuditLogs.Add(audit);

            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> VerifyUserAsync(int userId, bool isVerify, int adminId, string adminUsername)
        {
            var user = await _dbContext.Users.FindAsync(userId);

            if (user == null)
            {
                return false;
            }

            user.IsVerify = isVerify;

            var audit = new AuditLog
            {
                AdminId = adminId,
                AdminUsername = adminUsername,
                TargetUserId = userId,
                Action = isVerify ? "выдал верификацию" : "снял верификацию",
                TargetUsername = user.Username,
                CreatedAt = DateTime.UtcNow,
            };

            _dbContext.AuditLogs.Add(audit);

            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
