using anime_backend.DTOs.AnimeItem;
using anime_backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace anime_backend.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class AnimeItemController : ControllerBase
    {
        private readonly IAnimeItemService _animeItemService;

        public AnimeItemController(IAnimeItemService animeItemService)
        {
            _animeItemService = animeItemService;
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
        [HttpGet("random")]
        public async Task<AnimeItemResponseDto> GetRandomAnimeAsync()
        {
            return await _animeItemService.GetRandomAnimeAsync();
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
    }
}
