using anime_backend.Models;

namespace anime_backend.DTOs.AnimeItem
{
    public class CreateAnimeItemDto
    {
        public string Title { get; set; } = string.Empty;
        public string OriginalTitle { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? Episodes { get; set; }
        public int? MaxEpisodes { get; set; }
        public int? ReleaseYear { get; set; }
        public string Studio { get; set; } = string.Empty;

        public string? PosterUrl { get; set; } = string.Empty;

        public Season? Season { get; set; }
        public Status Status { get; set; }
        public Models.Type Type { get; set; }
    }
}
