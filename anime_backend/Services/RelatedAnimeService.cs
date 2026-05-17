using anime_backend.Data;
using anime_backend.DTOs.AnimeItem;
using anime_backend.Interfaces;
using anime_backend.Migrations;
using anime_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace anime_backend.Services
{
    public class RelatedAnimeService : IRelatedAnimeService
    {
        private readonly AppDbContext _dbContext;

        public RelatedAnimeService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreateRelatedAnime(int sourceId, int targetId)
        {
            if (sourceId == targetId) return;

            var exists = await _dbContext.RelatedAnimes.AnyAsync(r => r.SourceAnimeId == sourceId && r.TargetAnimeId == targetId);

            if (!exists)
            {
                _dbContext.RelatedAnimes.Add(new RelatedAnime
                {
                    SourceAnimeId = sourceId,
                    TargetAnimeId = targetId
                });
            }

            await _dbContext.SaveChangesAsync();
        }

        public async Task RemoveRelated(int sourceId, int targetId)
        {
            if (sourceId == targetId) return;
            var relation = await _dbContext.RelatedAnimes.FirstOrDefaultAsync(r => r.SourceAnimeId == sourceId && r.TargetAnimeId == targetId);

            if (relation != null)
            {
                _dbContext.Remove(relation);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<List<AnimeItem>> GetRelatedAnime(int animeId)
        {
            var relatedAnimes = await _dbContext.RelatedAnimes
                .Where(a => a.SourceAnimeId == animeId)
                .Select(a => a.TargetAnimeId)
                .ToListAsync();

            return await _dbContext.AnimeItem
                .Where(a => relatedAnimes.Contains(a.Id))
                .ToListAsync();
        }
    }
}
