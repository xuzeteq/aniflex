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

        public async Task<Comment> AddCommentAsync(int userId, int animeId, string text)
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

            return comment;
        }

        public async Task<List<CommentResponseDto>> GetUserCommentsAsync(int userId)
        {
            var user = await _dbContext.Users.FindAsync(userId);
            if (user == null) throw new Exception("error");

            var result = await _dbContext.Comments.Where(c => c.UserId == userId).Select(c => new CommentResponseDto
            {
                Id = c.Id,
                UserId = user.Id,
                Username = user.Username,
                AnimeId = c.AnimeId,
                AnimeName = c.Anime.Title,
                Text = c.Text,
                IsDeleted = c.IsDeleted,
                CreatedAt = c.CreatedAt
            }).ToListAsync();

            return result;
        }

        public async Task<List<CommentResponseDto>> GetAllCommentsAnimeAsync(int animeId)
        {
            var anime = await _dbContext.AnimeItem.FindAsync(animeId);
            if (anime == null) throw new Exception("error");

            var result = await _dbContext.Comments.Where(c => c.AnimeId == animeId).Select(c => new CommentResponseDto
            {
                Id = c.Id,
                UserId = c.UserId,
                Username = c.User.Username,
                AnimeId = c.AnimeId,
                AnimeName = c.Anime.Title,
                Text = c.Text,
                IsDeleted = c.IsDeleted,
                CreatedAt = c.CreatedAt
            }).ToListAsync();

            return result;
        }
    }
}