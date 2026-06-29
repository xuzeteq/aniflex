using anime_backend.Data;
using anime_backend.DTOs.AnimeItem;
using anime_backend.Interfaces;
using anime_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace anime_backend.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class AnimeItemController : ControllerBase
    {
        private readonly IAnimeItemService _animeItemService;
        private readonly AppDbContext _dbContext;

        public AnimeItemController(IAnimeItemService animeItemService, AppDbContext dbContext)
        {
            _animeItemService = animeItemService;
            _dbContext = dbContext;
        }

        [AllowAnonymous]
        [HttpGet("all-anime")]
        public async Task<List<AnimeItemResponseDto>> GetAllAnimeAsync()
        {
            return await _animeItemService.GetAllAnimeAsync();
        }

        [AllowAnonymous]
        [HttpGet("get-anime/{id}")]
        public async Task<IActionResult> GetAnimeByIdAsync(int id)
        {
            var anime = await _animeItemService.GetAnimeByIdAsync(id);
            return Ok(anime);
        }

        [AllowAnonymous]
        [HttpGet("ongoing-anime")]
        public async Task<List<AnimeItemResponseDto>> GetOngoingAnimeAsync()
        {
            return await _animeItemService.GetOngoingAnimeAsync();
        }

        [AllowAnonymous]
        [HttpGet("current-season")]
        public async Task<List<AnimeItemResponseDto>> GetAnimeCurrentSeasonAsync()
        {
            return await _animeItemService.GetAnimeCurrentSeasonAsync();
        }

        [AllowAnonymous]
        [HttpGet("prev-year")]
        public async Task<List<AnimeItemResponseDto>> GetAnimePrevYearAsync()
        {
            return await _animeItemService.GetAnimePrevYearAsync();
        }

        [AllowAnonymous]
        [HttpGet("this-year")]
        public async Task<List<AnimeItemResponseDto>> GetAnimeThisYearAsync()
        {
            return await _animeItemService.GetAnimeThisYearAsync();
        }

        [AllowAnonymous]
        [HttpGet("random")]
        public async Task<AnimeItemResponseDto> GetRandomAnimeAsync()
        {
            return await _animeItemService.GetRandomAnimeAsync();
        }

        [AllowAnonymous]
        [HttpGet("get-list")]
        public async Task<object> GetListAnimeAsync(int page = 1, int pageSize = 20)
        {
            return await _animeItemService.GetListAnimeAsync(page, pageSize);
        }

        [AllowAnonymous]
        [HttpGet("new")]
        public async Task<List<AnimeItemResponseDto>> GetNewAnimeAsync()
        {
            return await _animeItemService.GetNewAnimeAsync();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("create-anime")]
        public async Task<IActionResult> CreateAnimeAsync([FromBody] CreateAnimeItemDto dto)
        {
            var anime = await _animeItemService.CreateAnimeAsync(dto);
            return Ok(anime);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("patch-anime/{id}")]
        public async Task<IActionResult> PatchAnimeAsync(PatchAnimeItemDto dto, int id)
        {
            var anime = await _animeItemService.PatchAnimeAsync(dto, id);
            return Ok(anime);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("put-anime/{id}")]
        public async Task<IActionResult> PutAnimeAsync(PutAnimeItemDto dto, int id)
        {
            var anime = await _animeItemService.PutAnimeAsync(dto, id);
            return Ok(anime);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("add-genre")]
        public async Task<IActionResult> AddGenreToAnime(int animeId, int genreId)
        {
            await _animeItemService.AddGenreToAnime(animeId, genreId);
            return NoContent();
        }

        [AllowAnonymous]
        [HttpPost("import")]
        public async Task<IActionResult> ImportAnime([FromBody] List<AnimeItem> animeList)
        {
            if (animeList == null || animeList.Count == 0)
                return BadRequest("Список аниме пуст");

            var imported = 0;
            var skipped = 0;

            foreach (var anime in animeList)
            {
                var exists = await _dbContext.AnimeItem.AnyAsync(x => x.Id == anime.Id);

                if (!exists)
                {
                    anime.CreatedAt = DateTime.UtcNow;
                    await _dbContext.AnimeItem.AddAsync(anime);
                    imported++;
                }
                else
                {
                    skipped++;
                }
            }

            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                message = $"Импорт завершён",
                imported = imported,
                skipped = skipped,
                total = animeList.Count
            });
        }
    }
}
