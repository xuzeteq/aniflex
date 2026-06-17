using anime_backend.DTOs.Comment;
using anime_backend.Models;

namespace anime_backend.Interfaces
{
    public interface ICommentService
    {
        Task<List<CommentResponseDto>> GetAllCommentsAsync(string? searchByUsername);
         Task<Comment> AddCommentAsync(int userId, int animeId, string Text);
         Task<List<CommentResponseDto>> GetUserCommentsAsync(int userId);
         Task<List<CommentResponseDto>> GetAllCommentsAnimeAsync(int animeId);
    }
}