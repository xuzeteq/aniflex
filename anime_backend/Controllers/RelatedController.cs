using anime_backend.Interfaces;
using anime_backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace anime_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RelatedController : ControllerBase
    {
        private readonly IRelatedAnimeService _service;

        public RelatedController(IRelatedAnimeService service)
        {
            _service = service;
        }

        [HttpPost("add-related")]
        public async Task<IActionResult> CreateRelatedAnime(int sourceId, int targetId, string text)
        {
            await _service.CreateRelatedAnime(sourceId, targetId, text);
            return Ok();
        }

        [HttpPost("remove-relation")]
        public async Task<IActionResult> RemoveRelated(int sourceId, int targetId)
        {
            await _service.RemoveRelated(sourceId, targetId);
            return Ok();
        }

        [HttpGet("related-animes")]
        public async Task<List<AnimeItem>> GetRelatedAnime([FromQuery] int animeId)
        {
            return await _service.GetRelatedAnime(animeId);
        }
    }
}
