using System.Security.Claims;
using anime_backend.DTOs.Comment;
using anime_backend.Interfaces;
using anime_backend.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace anime_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _service;

        public CommentsController(ICommentService service)
        {
            _service = service;
        }

        [HttpGet("all-comments")]
        public async Task<List<CommentResponseDto>> GetAllCommentsAsync([FromQuery] string? searchByUsername)
        {
            return await _service.GetAllCommentsAsync(searchByUsername);
        }
        
        [HttpGet("comments/{userId}")]
        public async Task<List<CommentResponseDto>> GetCommentsAsync(int userId)
        {
            return await _service.GetUserCommentsAsync(userId);
        }

        [HttpGet("anime-comments/{animeId}")]
        public async Task<List<CommentResponseDto>> GetAllCommentsAnimeAsync(int animeId)
        {
            return await _service.GetAllCommentsAnimeAsync(animeId);
        }

        [HttpPost("addComment")]
        [Authorize]
        public async Task<IActionResult> AddCommentAsync(int animeId, string text)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var comment = await _service.AddCommentAsync(userId, animeId, text);
            return Ok(comment);
        }
    }
}
