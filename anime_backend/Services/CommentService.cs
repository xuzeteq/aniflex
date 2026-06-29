using anime_backend.Data;
using anime_backend.DTOs.Comment;
using anime_backend.Interfaces;
using anime_backend.Migrations;
using anime_backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace anime_backend.Services
{
    public class CommentService : ICommentService
    {
        private readonly AppDbContext _dbContext;

        public CommentService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<CommentResponseDto>> GetAllCommentsAsync(string? searchByUsername)
        {
            var query = _dbContext.Comments
                .Include(c => c.Anime)
                .Include(c => c.User)
                .Select(c => new CommentResponseDto
                    {
                        Id = c.Id,
                        UserId = c.UserId,
                        Username = c.User.Username,
                        AnimeId = c.AnimeId,
                        AnimeName = c.Anime.Title,
                        Text = c.Text,
                        IsDeleted = c.IsDeleted,
                        CreatedAt = c.CreatedAt
                    });

            if (!string.IsNullOrEmpty(searchByUsername))
            {
                query = query.Where(c => c.Username.ToLower().Contains(searchByUsername.ToLower()));
            }

            return await query.ToListAsync();
        }

        public async Task<CommentResponseDto> AddCommentAsync(int userId, int animeId, string text)
        {
            var user = await _dbContext.Users.FindAsync(userId);
            var anime = await _dbContext.AnimeItem.FirstOrDefaultAsync(a => a.Id == animeId);

            if (user == null) throw new Exception("err");
            if (anime == null) throw new Exception("anime not found");

            var comment = new Comment
            {
                UserId = user.Id,
                AnimeId = anime.Id,
                Text = text,
                IsDeleted = false,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Comments.Add(comment);
            await _dbContext.SaveChangesAsync();

            var result = new CommentResponseDto
                {
                    AnimeId = comment.Anime.Id,
                    UserId = comment.User.Id,
                    AnimeName = comment.Anime.Title,
                    Username = comment.User.Username,
                    UserRole = comment.User.Role,
                    AvatarUrl = comment.User.AvatarUrl,
                    IsDeleted = comment.IsDeleted,
                    Text = comment.Text,
                    CreatedAt = comment.CreatedAt,
                };

            return result;
        }

        public async Task<List<CommentResponseDto>> GetUserCommentsAsync(int userId)
        {
            var result = await _dbContext.Comments
                .Include(c => c.User)
                .Include(c => c.Anime)
                .Where(c => c.UserId == userId && !c.IsDeleted)
                .Select(c => new CommentResponseDto
                {
                    AnimeId = c.Anime.Id,
                    UserId = c.User.Id,
                    AnimeName = c.Anime.Title,
                    Username = c.User.Username,
                    UserRole = c.User.Role,
                    AvatarUrl = c.User.AvatarUrl,
                    IsDeleted = c.IsDeleted,
                    Text = c.Text,
                    CreatedAt = c.CreatedAt,
                }).ToListAsync();

            return result;
        }

        public async Task<List<CommentResponseDto>> GetAllCommentsAnimeAsync(int animeId)
        {
            var result = await _dbContext.Comments
                .Include(c => c.User)
                .Include(c => c.Anime)
                .Where(c => c.AnimeId == animeId)
                .Select(c => new CommentResponseDto
                {
                    AnimeId = c.Anime.Id,
                    UserId = c.User.Id,
                    AnimeName = c.Anime.Title,
                    Username = c.User.Username,
                    UserRole = c.User.Role,
                    AvatarUrl = c.User.AvatarUrl,
                    IsDeleted = c.IsDeleted,
                    Text = c.Text,
                    CreatedAt = c.CreatedAt,
                }).ToListAsync();

            return result;
        }
    }
}