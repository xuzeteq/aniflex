using anime_backend.Data;
using anime_backend.DTOs.AnimeItem;
using anime_backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace anime_backend.Services
{
    public class RatingService : IRatingService
    {
        private readonly AppDbContext _dbContext;

        public RatingService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<double> RateAnimeAsync(int animeId, int userId, int value)
        {
            var anime = await _dbContext.AnimeItem.FindAsync(animeId);
            var existing = await _dbContext.Ratings.FirstOrDefaultAsync(r => r.UserId == userId && r.AnimeId == animeId);
            var user = await _dbContext.Users.FindAsync(userId);

            if (value < 1 || value > 10)
                throw new Exception("Value error");

            if (anime == null) throw new Exception("Anime Not Found");

            if (existing != null)
            {
                existing.Value = value;
                existing.CreatedAt = DateTime.UtcNow;
            }
            else
            {
                _dbContext.Ratings.Add(new Models.Rating
                {
                    AnimeId = animeId,
                    UserId = userId,
                    Value = value,
                    CreatedAt = DateTime.UtcNow,
                });
                user!.RatingsCount++;
            }

            await _dbContext.SaveChangesAsync();

            var ratings = await _dbContext.Ratings.Where(r => r.AnimeId == animeId).ToListAsync();
            
            anime.AverageRating = ratings.Any() ? ratings.Average(r => r.Value) : 0;
            anime.RatingsCount = ratings.Count();

            await _dbContext.SaveChangesAsync();

            return anime.AverageRating;
        }

        public async Task<double> GetUserRatingAsync(int userId, int animeId)
        {
            var rating = await _dbContext.Ratings.FirstOrDefaultAsync(r => r.UserId == userId && r.AnimeId == animeId);
            return rating?.Value ?? 0;
        }

    }
}
