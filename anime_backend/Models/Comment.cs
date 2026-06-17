namespace anime_backend.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int AnimeId { get; set; }
        public AnimeItem Anime { get; set; } = null!;

        public string Text { get; set; } = string.Empty;
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}