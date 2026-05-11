using anime_backend.Data;
using anime_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace anime_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FavouriteController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FavouriteController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier.ToString())?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Пользователь не авторизован" });

            var userId = int.Parse(userIdClaim);

            var favorites = await _context.Favourites
                .Where(f => f.UserId == userId)
                .Include(f => f.Anime)
                .Select(f => f.Anime)
                .ToListAsync();

            return Ok(favorites);
        }

        [HttpGet("ids")]
        public async Task<IActionResult> GetFavoriteIds()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier.ToString())?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Пользователь не авторизован" });

            var userId = int.Parse(userIdClaim);

            var ids = await _context.Favourites
                .Where(f => f.UserId == userId)
                .Select(f => f.AnimeId)
                .ToListAsync();

            return Ok(ids);
        }

        [HttpPost("{animeId}")]
        public async Task<IActionResult> AddFavorite(int animeId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier.ToString())?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Пользователь не авторизован" });

            var userId = int.Parse(userIdClaim);

            var exists = await _context.Favourites
                .AnyAsync(f => f.UserId == userId && f.AnimeId == animeId);

            if (exists)
                return Ok(new { isFavorite = true });

            var favorite = new Favourite
            {
                UserId = userId,
                AnimeId = animeId,
                CreatedAt = DateTime.UtcNow
            };

            var user = await _context.Users.FindAsync(userId);
            user!.FavouritesCount++;

            _context.Favourites.Add(favorite);
            await _context.SaveChangesAsync();

            return Ok(new { isFavorite = true });
        }

        [HttpDelete("{animeId}")]
        public async Task<IActionResult> RemoveFavorite(int animeId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier.ToString())?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Пользователь не авторизован" });

            var userId = int.Parse(userIdClaim);

            var favorite = await _context.Favourites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.AnimeId == animeId);

            var user = await _context.Users.FindAsync(userId);
            user!.FavouritesCount--;

            if (favorite != null)
            {
                _context.Favourites.Remove(favorite);
                await _context.SaveChangesAsync();
            }

            return Ok(new { isFavorite = false });
        }
    }
}