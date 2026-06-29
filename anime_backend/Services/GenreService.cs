using anime_backend.Data;
using anime_backend.DTOs.Genre;
using anime_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace anime_backend.Services
{
    public class GenreService
    {
        private readonly AppDbContext _dbContext;

        public GenreService(AppDbContext dbContext)
        {
            _dbContext = dbContext; 
        }

        public async Task<GenreResponseDto> AddGenre(CreateGenreDto dto)
        {
            var genre = _dbContext.Genres.FirstOrDefault(g => g.Name == dto.Name);

            if (genre != null)
                throw new Exception("Жанр уже существует!");

            var newGenre = new Genre
            {
                Name = dto.Name
            };

            _dbContext.Genres.Add(newGenre);
            await _dbContext.SaveChangesAsync();

            return new GenreResponseDto
            {
                Id = newGenre.Id,
                Name = newGenre.Name
            };
        }

        public async Task<List<GenreResponseDto>> GetGenresAsync()
        {
            return await _dbContext.Genres.Select(g => new GenreResponseDto
            {
                Id= g.Id,
                Name = g.Name
            }).ToListAsync();
        }
    }
}
