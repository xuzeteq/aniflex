namespace anime_backend.Models
{
    public class Episode
    {
        public int Id { get; set; }
        public int AnimeId { get; set; }
        public AnimeItem Anime { get; set; } = null!;
        public string Title { get; set; } = string.Empty;
        public int EpisodeNumber { get; set; }
        public string VideoUrl { get; set; } = string.Empty; 
    }
}
