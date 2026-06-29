using anime_backend.Data;
using anime_backend.DTOs.AnimeItem;
using anime_backend.Interfaces;
using anime_backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace anime_backend.Services
{
    public class AnimeItemService : IAnimeItemService
    {
        private readonly AppDbContext _dbContext;
        private readonly ILogger<AnimeItemService> _logger;

        public AnimeItemService(AppDbContext dbContext, ILogger<AnimeItemService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<List<AnimeItemResponseDto>> GetAllAnimeAsync()
        {
            var items = await _dbContext.AnimeItem
                .Include(a => a.AnimeGenres)
                .ThenInclude(ag => ag.Genre)
                .ToListAsync();

            var result = new List<AnimeItemResponseDto>();

            foreach (var a in items)
            {
                var episodesCount = await _dbContext.Episodes.CountAsync(e => e.AnimeId == a.Id);

                result.Add(new AnimeItemResponseDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    OriginalTitle = a.OriginalTitle,
                    Description = a.Description,
                    Episodes = episodesCount,
                    MaxEpisodes = a.MaxEpisodes,
                    Rating = a.Rating,
                    AverageRating = a.AverageRating,
                    RatingsCount = a.RatingsCount,
                    ReleaseYear = a.ReleaseYear,
                    Studio = a.Studio,
                    PosterUrl = a.PosterUrl,
                    Season = a.Season,
                    Status = a.Status,
                    Type = a.Type,
                    CreatedAt = a.CreatedAt,
                    Genres = a.AnimeGenres.Select(ag => ag.Genre.Name).ToList()
                });
            }

            return result;
        }

        public async Task<AnimeItemResponseDto> GetAnimeByIdAsync(int id)
        {
            var anime = await _dbContext.AnimeItem.Include(a => a.AnimeGenres)
                .ThenInclude(ag => ag.Genre)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (anime == null)
                throw new Exception("Аниме не найдено!");

            var genreName = anime.AnimeGenres.Select(ag => ag.Genre.Name).ToList();
            var episodesCount = await _dbContext.Episodes.CountAsync(e => e.AnimeId == anime.Id);

            return new AnimeItemResponseDto
            {
                Id = anime.Id,
                Title = anime.Title,
                OriginalTitle = anime.OriginalTitle,
                Description = anime.Description,
                Episodes = episodesCount,
                MaxEpisodes = anime.MaxEpisodes,
                Rating = anime.Rating,
                AverageRating = anime.AverageRating,
                RatingsCount = anime.RatingsCount,                
                ReleaseYear = anime.ReleaseYear,
                Studio = anime.Studio,
                PosterUrl = anime.PosterUrl,
                Season = anime.Season,
                Status = anime.Status,
                Type = anime.Type,
                Genres = genreName,
                CreatedAt = anime.CreatedAt
            };
        }

        public async Task<List<AnimeItemResponseDto>> GetOngoingAnimeAsync()
        {
            var items = await _dbContext.AnimeItem
                .Where(a => a.Status == Status.Онгоинг)
                .Include(a => a.AnimeGenres)
                .ThenInclude(ag => ag.Genre)
                .ToListAsync();

            var result = new List<AnimeItemResponseDto>();

            foreach (var a in items)
            {
                var episodesCount = await _dbContext.Episodes.CountAsync(e => e.AnimeId == a.Id);

                result.Add(new AnimeItemResponseDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    OriginalTitle = a.OriginalTitle,
                    Description = a.Description,
                    Episodes = episodesCount,
                    MaxEpisodes = a.MaxEpisodes,
                    Rating = a.Rating,
                    AverageRating = a.AverageRating,
                    RatingsCount = a.RatingsCount,
                    ReleaseYear = a.ReleaseYear,
                    Studio = a.Studio,
                    PosterUrl = a.PosterUrl,
                    Season = a.Season,
                    Status = a.Status,
                    Type = a.Type,
                    CreatedAt = a.CreatedAt,
                    Genres = a.AnimeGenres.Select(ag => ag.Genre.Name).ToList()
                });
            }

            return result;
        }

        public async Task<List<AnimeItemResponseDto>> GetAnimeCurrentSeasonAsync()
        {
            var currentYear = DateTime.UtcNow.Year;
            var currentSeason = GetCurrentSeason();

            var items = await _dbContext.AnimeItem
                .Where(a => a.Season == currentSeason && a.ReleaseYear == currentYear)
                .Include(a => a.AnimeGenres)
                .ThenInclude(ag => ag.Genre)
                .ToListAsync();

            var result = new List<AnimeItemResponseDto>();

            foreach (var a in items)
            {
                var episodesCount = await _dbContext.Episodes.CountAsync(e => e.AnimeId == a.Id);

                result.Add(new AnimeItemResponseDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    OriginalTitle = a.OriginalTitle,
                    Description = a.Description,
                    Episodes = episodesCount,
                    MaxEpisodes = a.MaxEpisodes,
                    Rating = a.Rating,
                    AverageRating = a.AverageRating,
                    RatingsCount = a.RatingsCount,
                    ReleaseYear = a.ReleaseYear,
                    Studio = a.Studio,
                    PosterUrl = a.PosterUrl,
                    Season = a.Season,
                    Status = a.Status,
                    Type = a.Type,
                    CreatedAt = a.CreatedAt,
                    Genres = a.AnimeGenres.Select(ag => ag.Genre.Name).ToList()
                });
            }

            return result;
        }

        public async Task<List<AnimeItemResponseDto>> GetAnimePrevYearAsync()
        {
            var items = await _dbContext.AnimeItem
                .Where(a => a.ReleaseYear == DateTime.UtcNow.Year - 1)
                .Include(a => a.AnimeGenres)
                .ThenInclude(ag => ag.Genre)
                .ToListAsync();

            var result = new List<AnimeItemResponseDto>();

            foreach (var a in items)
            {
                var episodesCount = await _dbContext.Episodes.CountAsync(e => e.AnimeId == a.Id);

                result.Add(new AnimeItemResponseDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    OriginalTitle = a.OriginalTitle,
                    Description = a.Description,
                    Episodes = episodesCount,
                    MaxEpisodes = a.MaxEpisodes,
                    Rating = a.Rating,
                    AverageRating = a.AverageRating,
                    RatingsCount = a.RatingsCount,
                    ReleaseYear = a.ReleaseYear,
                    Studio = a.Studio,
                    PosterUrl = a.PosterUrl,
                    Season = a.Season,
                    Status = a.Status,
                    Type = a.Type,
                    CreatedAt = a.CreatedAt,
                    Genres = a.AnimeGenres.Select(ag => ag.Genre.Name).ToList()
                });
            }

            return result;
        }

        public async Task<List<AnimeItemResponseDto>> GetAnimeThisYearAsync()
        {
            var items = await _dbContext.AnimeItem
                .Where(a => a.ReleaseYear == DateTime.UtcNow.Year)
                .Include(a => a.AnimeGenres)
                .ThenInclude(ag => ag.Genre)
                .ToListAsync();

            var result = new List<AnimeItemResponseDto>();

            foreach (var a in items)
            {
                var episodesCount = await _dbContext.Episodes.CountAsync(e => e.AnimeId == a.Id);

                result.Add(new AnimeItemResponseDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    OriginalTitle = a.OriginalTitle,
                    Description = a.Description,
                    Episodes = episodesCount,
                    MaxEpisodes = a.MaxEpisodes,
                    Rating = a.Rating,
                    AverageRating = a.AverageRating,
                    RatingsCount = a.RatingsCount,
                    ReleaseYear = a.ReleaseYear,
                    Studio = a.Studio,
                    PosterUrl = a.PosterUrl,
                    Season = a.Season,
                    Status = a.Status,
                    Type = a.Type,
                    CreatedAt = a.CreatedAt,
                    Genres = a.AnimeGenres.Select(ag => ag.Genre.Name).ToList()
                });
            }

            return result;
        }

        public async Task<List<AnimeItemResponseDto>> GetNewAnimeAsync()
        {
            var items = await _dbContext.AnimeItem
                .OrderByDescending(ai => ai.CreatedAt)
                .Include(a => a.AnimeGenres)
                .ThenInclude(ag => ag.Genre)
                .Take(6)
                .ToListAsync();

            var result = new List<AnimeItemResponseDto>();

            foreach (var a in items)
            {
                var episodesCount = await _dbContext.Episodes.CountAsync(e => e.AnimeId == a.Id);

                result.Add(new AnimeItemResponseDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    OriginalTitle = a.OriginalTitle,
                    Description = a.Description,
                    Episodes = episodesCount,
                    MaxEpisodes = a.MaxEpisodes,
                    Rating = a.Rating,
                    AverageRating = a.AverageRating,
                    RatingsCount = a.RatingsCount,
                    ReleaseYear = a.ReleaseYear,
                    Studio = a.Studio,
                    PosterUrl = a.PosterUrl,
                    Season = a.Season,
                    Status = a.Status,
                    Type = a.Type,
                    CreatedAt = a.CreatedAt,
                    Genres = a.AnimeGenres.Select(ag => ag.Genre.Name).ToList()
                });
            }

            return result;
        }

        public async Task<AnimeItemResponseDto> GetRandomAnimeAsync()
        {
            var countAnime = await _dbContext.AnimeItem.CountAsync();

            if (countAnime == 0)
                throw new Exception("No anime");


            var random = new Random();
            var skip = random.Next(0, countAnime);


            var randomAnime = await _dbContext.AnimeItem.OrderBy(a => a.Id).Skip(skip).FirstOrDefaultAsync();

            var genreName = randomAnime!.AnimeGenres.Select(ag => ag.Genre.Name).ToList();
            var episodesCount = await _dbContext.Episodes.CountAsync(e => e.AnimeId == randomAnime.Id);

            return new AnimeItemResponseDto
            {
                Id = randomAnime.Id,
                Title = randomAnime.Title,
                OriginalTitle = randomAnime.OriginalTitle,
                Description = randomAnime.Description,
                Episodes = episodesCount,
                MaxEpisodes = randomAnime.MaxEpisodes,
                Rating = randomAnime.Rating,
                AverageRating = randomAnime.AverageRating,
                RatingsCount = randomAnime.RatingsCount,
                ReleaseYear = randomAnime.ReleaseYear,
                Studio = randomAnime.Studio,
                PosterUrl = randomAnime.PosterUrl,
                Season = randomAnime.Season,
                Status = randomAnime.Status,
                Type = randomAnime.Type,
                Genres = genreName,
                CreatedAt = randomAnime.CreatedAt
            };
        }

        public async Task<object> GetListAnimeAsync(int page = 1, int pageSize = 20)
        {
            var query = _dbContext.AnimeItem.AsQueryable();

            var total = await query.CountAsync();
            var items = await query.OrderByDescending(x => x.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            var result = new List<AnimeItemResponseDto>();

            foreach (var item in items)
            {
                var genreName = item!.AnimeGenres.Select(ag => ag.Genre.Name).ToList();
                var episodesCount = await _dbContext.Episodes.CountAsync(e => e.AnimeId == item.Id);

                result.Add(new AnimeItemResponseDto
                {
                    Id = item.Id,
                    Title = item.Title,
                    OriginalTitle = item.OriginalTitle,
                    Description = item.Description,
                    Episodes = episodesCount,
                    MaxEpisodes = item.MaxEpisodes,
                    Rating = item.Rating,
                    AverageRating = item.AverageRating,
                    RatingsCount = item.RatingsCount,
                    ReleaseYear = item.ReleaseYear,
                    Studio = item.Studio,
                    PosterUrl = item.PosterUrl,
                    Season = item.Season,
                    Status = item.Status,
                    Type = item.Type,
                    Genres = genreName,
                    CreatedAt = item.CreatedAt
                });
            }

            return new
            {
                Items = result,
                Total = total,
                TotalPages = (int)Math.Ceiling(total / (double)pageSize),
                CurrentPage = page,
                PageSize = pageSize
            };
        }

        //public async Task<AnimeItemResponseDto> GetRelatedAnime()
        //{

        //}

        public async Task<AnimeItemResponseDto> CreateAnimeAsync(CreateAnimeItemDto dto)
        {
            var existingAnime = await _dbContext.AnimeItem.FirstOrDefaultAsync(a => a.OriginalTitle == dto.OriginalTitle);

            if (existingAnime != null)
            {
                _logger.LogWarning("Аниме уже есть в базе данных: {anime}", existingAnime);
                throw new Exception("Такое аниме уже существует!");
            }

            var anime = new AnimeItem
            {
                Title = dto.Title,
                OriginalTitle = dto.OriginalTitle,
                Description = dto.Description,
                Episodes = dto.Episodes,
                MaxEpisodes = dto.MaxEpisodes,
                ReleaseYear = dto.ReleaseYear,
                Rating = 0,
                AverageRating = 0,
                RatingsCount = 0,
                Studio = dto.Studio,
                PosterUrl= dto.PosterUrl,
                Season = dto.Season,
                Status= dto.Status,
                Type= dto.Type,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Add(anime);
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation("Добавлено аниме: {anime}", anime);

            return new AnimeItemResponseDto
            {
                Id = anime.Id,
                Title = anime.Title,
                OriginalTitle = anime.OriginalTitle,
                Description = anime.Description,
                Episodes = anime.Episodes,
                MaxEpisodes = anime.MaxEpisodes,
                Rating = anime.Rating,
                AverageRating = anime.AverageRating,
                RatingsCount = anime.RatingsCount,
                ReleaseYear = anime.ReleaseYear,
                Studio = anime.Studio,
                PosterUrl = anime.PosterUrl,
                Season = anime.Season,
                Status = anime.Status,
                Type = anime.Type,
                CreatedAt = anime.CreatedAt
            };
        }

        public async Task<AnimeItemResponseDto> PatchAnimeAsync(PatchAnimeItemDto dto, int id)
        {
            var existingAnime = await _dbContext.AnimeItem.FindAsync(id);

            if (existingAnime == null)
            {
                _logger.LogWarning("Аниме не найдено: {anime}", existingAnime);
                throw new Exception("Аниме не найдено");
            }

            if (!string.IsNullOrEmpty(dto.Title))
                existingAnime.Title = dto.Title;

            if (!string.IsNullOrEmpty(dto.OriginalTitle))
                existingAnime.OriginalTitle = dto.OriginalTitle;

            if (!string.IsNullOrEmpty(dto.Description))
                existingAnime.Description = dto.Description;

            if (dto.Episodes.HasValue)
                existingAnime.Episodes = dto.Episodes;

            if (dto.MaxEpisodes.HasValue)
                existingAnime.MaxEpisodes = dto.MaxEpisodes;

            if (dto.ReleaseYear.HasValue)
                existingAnime.ReleaseYear = dto.ReleaseYear;

            if (!string.IsNullOrEmpty(dto.Studio))
                existingAnime.Studio = dto.Studio;

            if (!string.IsNullOrEmpty(dto.PosterUrl))
                existingAnime.PosterUrl = dto.PosterUrl;

            if (dto.Type.HasValue)
                existingAnime.Type = dto.Type.Value;

            if (dto.Season.HasValue)
                existingAnime.Season = dto.Season;

            if (dto.Status.HasValue)
                existingAnime.Status = dto.Status.Value;

            await _dbContext.SaveChangesAsync();
            _logger.LogInformation("Аниме обновлено: {anime}", existingAnime);

            return new AnimeItemResponseDto
            {
                Id = existingAnime.Id,
                Title = existingAnime.Title,
                OriginalTitle = existingAnime.OriginalTitle,
                Description = existingAnime.Description,
                Episodes = existingAnime.Episodes,
                MaxEpisodes = existingAnime.MaxEpisodes,
                Rating = existingAnime.Rating,
                AverageRating = existingAnime.AverageRating,
                RatingsCount = existingAnime.RatingsCount,
                ReleaseYear = existingAnime.ReleaseYear,
                Studio = existingAnime.Studio,
                PosterUrl = existingAnime.PosterUrl,
                Season = existingAnime.Season,
                Status = existingAnime.Status,
                Type = existingAnime.Type,
                CreatedAt = existingAnime.CreatedAt
            };
        }

        public async Task<AnimeItemResponseDto> PutAnimeAsync(PutAnimeItemDto dto, int id)
        {
            var existingAnime = await _dbContext.AnimeItem.FindAsync(id);

            if (existingAnime == null)
            {
                _logger.LogWarning("Аниме не найдено: {anime}", existingAnime);
                throw new Exception("Аниме не найдено");
            }

            existingAnime.Title = dto.Title;
            existingAnime.OriginalTitle = dto.OriginalTitle;
            existingAnime.Description = dto.Description;
            existingAnime.Episodes = dto.Episodes;
            existingAnime.MaxEpisodes = dto.MaxEpisodes;
            existingAnime.ReleaseYear = dto.ReleaseYear;
            existingAnime.Studio = dto.Studio;
            existingAnime.PosterUrl = dto.PosterUrl;
            existingAnime.Season = dto.Season;
            existingAnime.Status = dto.Status;
            existingAnime.Type = dto.Type;

            await _dbContext.SaveChangesAsync();
            _logger.LogInformation("Аниме обновлено: {anime}", existingAnime);

            return new AnimeItemResponseDto
            {
                Id = existingAnime.Id,
                Title = existingAnime.Title,
                OriginalTitle = existingAnime.OriginalTitle,
                Description = existingAnime.Description,
                Episodes = existingAnime.Episodes,
                MaxEpisodes = existingAnime.MaxEpisodes,
                Rating = existingAnime.Rating,
                RatingsCount = existingAnime.RatingsCount,
                AverageRating = existingAnime.AverageRating,
                ReleaseYear = existingAnime.ReleaseYear,
                Studio = existingAnime.Studio,
                PosterUrl = existingAnime.PosterUrl,
                Season = existingAnime.Season,
                Status = existingAnime.Status,
                Type = existingAnime.Type,
                CreatedAt = existingAnime.CreatedAt
            };
        }

        public async Task AddGenreToAnime(int animeId, int genreId)
        {
            var anime = await _dbContext.AnimeItem.FindAsync(animeId);
            var genre = await _dbContext.Genres.FindAsync(genreId);

            if (anime == null || genre == null)
            {
                _logger.LogWarning("Аниме: {anime} или жанр: {genre} не найдены!", anime, genre);
                throw new Exception("Жанр или аниме не найдены!");
            }

            var animeGenre = new AnimeGenre
            {
                AnimeItemId = animeId,
                GenreId = genreId,
            };

            _dbContext.Add(animeGenre);
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation("Аниме: {anime} получило жанр: {genre}", anime, genre);
        }

        private Season GetCurrentSeason()
        {
            var currentMonth = DateTime.UtcNow.Month;

            return currentMonth switch
            {
                3 or 4 or 5 => Season.Весна,
                6 or 7 or 8 => Season.Лето,
                9 or 10 or 11 => Season.Осень,
                _ => Season.Зима
            };
        }

    }
}
