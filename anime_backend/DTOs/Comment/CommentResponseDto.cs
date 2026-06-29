namespace anime_backend.DTOs.Comment
{
    public class CommentResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public string UserRole { get; set; } = string.Empty;
        public string AnimeName { get; set; } = string.Empty;
        public int AnimeId { get; set; }
        public string Text { get; set; } = string.Empty;
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}