using anime_backend.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace anime_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RatingController : ControllerBase
    {
        private readonly IRatingService _ratingService;
        public RatingController(IRatingService ratingService)
        {
            _ratingService = ratingService;
        }

        [HttpPost("rate-anime")]
        public async Task<IActionResult> RateAnimeAsync(int animeId, [FromBody] RateAnimeRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var rating = await _ratingService.RateAnimeAsync(animeId, userId, request.Value);
            return Ok(rating);
        }

        [HttpGet("user-rating")]
        public async Task<IActionResult> GetUserRatingAsync(int animeId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var rating = await _ratingService.GetUserRatingAsync(userId, animeId);
            return Ok(rating);
        }
    }

    public class RateAnimeRequest
    {
        public int Value { get; set; }
    }
}
