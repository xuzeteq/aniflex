using anime_backend.Data;
using anime_backend.DTOs.Subscribe;
using anime_backend.Interfaces;
using anime_backend.Models;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL.Infrastructure.Internal;

namespace anime_backend.Services
{
    public class SubscribeService : ISubscribeService
    {
        private readonly AppDbContext _dbContext;

        public SubscribeService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<SubscribeResponseDto> ActiveSubscribe(int userId, int days)
        {
            var user = await _dbContext.Users.FindAsync(userId);

            if (user == null)
                throw new Exception("Пользователь не найден!");

            var sub = new Subscribe
            {
                UserId = user.Id,
                IsActive = true,
                StartAt = DateTime.UtcNow,
                EndAt = DateTime.UtcNow.AddDays(days),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            user.IsSubscriber = true;

            _dbContext.Subscribes.Add(sub);
            await _dbContext.SaveChangesAsync();

            return new SubscribeResponseDto
            {
                Id = sub.Id,
                UserId = sub.UserId,
                StartAt = sub.StartAt,
                EndAt = sub.EndAt,
                CreatedAt = sub.CreatedAt,
                UpdatedAt = sub.UpdatedAt,
                IsActive = sub.IsActive,
            };
        }

        public async Task<bool> RemoveSubscribe(int userId)
        {
            var user = await _dbContext.Users.FindAsync(userId);
            var subscribe = await _dbContext.Subscribes.FirstOrDefaultAsync(s => s.UserId == user!.Id);

            if (subscribe == null)
                throw new Exception("Подписка не найдена!");

            if (user == null)
                throw new Exception("Пользователь не найден!");

            if (!user.IsSubscriber)
                throw new Exception("У пользователя нет подписки!");

            user.IsSubscriber = false;
            subscribe.IsActive = false;
            subscribe.EndAt = DateTime.UtcNow;
            subscribe.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();

            return true;
        }
    }
}
