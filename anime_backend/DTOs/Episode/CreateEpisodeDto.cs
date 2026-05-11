namespace anime_backend.DTOs.Episode
{
    public class CreateEpisodeDto
    {
        public int AnimeId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int EpisodeNumber { get; set; }
        public string VideoUrl { get; set; } = string.Empty;
    }
}
