using anime_backend.DTOs.Genre;
using anime_backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace anime_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly GenreService _service;

        public GenreController(GenreService service)
        {
            _service = service;
        }

        [HttpPost("create-genre")]
        public async Task<IActionResult> CreateGenre(CreateGenreDto dto)
        {
            var genre = await _service.AddGenre(dto);
            return Ok(genre);
        }
    }
}
