using anime_backend.DTOs.Episode;
using anime_backend.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace anime_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EpisodeController : ControllerBase
    {
        private readonly IEpisodeService _episodeService;

        public EpisodeController(IEpisodeService episodeService)
        {
            _episodeService = episodeService;
        }

        [HttpGet("all-episodes")]
        public async Task<List<EpisodeResponseDto>> GetAllEpisodesAsync()
        {
            return await _episodeService.GetAllEpisodesAsync();
        }

        [HttpGet("episode/{id}")]
        public async Task<EpisodeResponseDto> GetEpisodeByIdAsync(int id)
        {
            return await _episodeService.GetEpisodeByIdAsync(id);
        }

        [HttpGet("episodes-by-anime")]
        public async Task<List<EpisodeResponseDto>> GetlEpisodesByAnimeIdAsync([FromQuery] int animeId)
        {
            return await _episodeService.GetlEpisodesByAnimeIdAsync(animeId);
        }

        [HttpPost("create-episode")]
        public async Task<IActionResult> CreateEpisodeAsync(CreateEpisodeDto dto)
        {
            var episode = await _episodeService.CreateEpisodeAsync(dto);
            return Ok(episode);
        }
    }
}
