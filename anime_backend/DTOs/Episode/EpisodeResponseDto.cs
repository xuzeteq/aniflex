namespace anime_backend.DTOs.Episode
{
    public class EpisodeResponseDto
    {
        public int Id { get; set; }
        public int AnimeId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int EpisodeNumber { get; set; }
        public string VideoUrl { get; set; } = string.Empty;
    }
}
