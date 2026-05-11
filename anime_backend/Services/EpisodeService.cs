using anime_backend.Data;
using anime_backend.DTOs.Episode;
using anime_backend.Interfaces;
using anime_backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Xml;

namespace anime_backend.Services
{
    public class EpisodeService : IEpisodeService
    {
        private readonly AppDbContext _dbContext;

        public EpisodeService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<EpisodeResponseDto>> GetAllEpisodesAsync()
        {
            return await _dbContext.Episodes.Select(e => new EpisodeResponseDto
            {
                Id = e.Id,
                AnimeId = e.AnimeId,
                Title = e.Title,
                EpisodeNumber = e.EpisodeNumber,
                VideoUrl = e.VideoUrl,
            }).ToListAsync();
        }

        public async Task<EpisodeResponseDto> GetEpisodeByIdAsync(int id)
        {
            var episode = await _dbContext.Episodes.FindAsync(id);

            if (episode == null)
                throw new Exception("Episode не найден");

            return new EpisodeResponseDto
            {
                Id = episode.Id,
                AnimeId = episode.AnimeId,
                Title = episode.Title,
                EpisodeNumber = episode.EpisodeNumber,
                VideoUrl = episode.VideoUrl
            };
        }

        public async Task<List<EpisodeResponseDto>> GetlEpisodesByAnimeIdAsync(int animeId)
        {
            var anime = await _dbContext.AnimeItem.FindAsync(animeId);

            if (anime == null)
                throw new Exception("Аниме не найдено!");

            var episodes = await _dbContext.Episodes
                .Where(e => e.AnimeId == animeId)
                .OrderBy(e => e.EpisodeNumber)
                .Select(e => new EpisodeResponseDto
                {
                    Id = e.Id,
                    AnimeId = e.AnimeId,
                    Title = e.Title,
                    EpisodeNumber = e.EpisodeNumber,
                    VideoUrl = e.VideoUrl

                }).ToListAsync();

            return episodes;
        }

        public async Task<EpisodeResponseDto> CreateEpisodeAsync(CreateEpisodeDto dto)
        {
            var anime = await _dbContext.AnimeItem.FindAsync(dto.AnimeId);

            if (anime == null)
                throw new Exception("Аниме не найдено!");

            var existingEpisode = await _dbContext.Episodes.AnyAsync(e => e.AnimeId == dto.AnimeId && e.EpisodeNumber == dto.EpisodeNumber);

            if (existingEpisode)
                throw new Exception("Серия уже существует!");

            var episode = new Episode
            {
                AnimeId = dto.AnimeId,
                Title = dto.Title,
                EpisodeNumber = dto.EpisodeNumber,
                VideoUrl = dto.VideoUrl,
            };

            _dbContext.Episodes.Add(episode);
            await _dbContext.SaveChangesAsync();

            return new EpisodeResponseDto
            {
                Id = episode.Id,
                AnimeId = episode.AnimeId,
                Title = episode.Title,
                EpisodeNumber = episode.EpisodeNumber,
                VideoUrl = episode.VideoUrl
            };

        }
    }
}
