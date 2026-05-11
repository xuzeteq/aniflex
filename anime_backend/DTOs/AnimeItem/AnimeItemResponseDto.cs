using anime_backend.Models;

namespace anime_backend.DTOs.AnimeItem
{
    public class AnimeItemResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string OriginalTitle { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? Episodes { get; set; }
        public int? MaxEpisodes { get; set; }
        public decimal Rating { get; set; }
        public int? ReleaseYear { get; set; }
        public string Studio { get; set; } = string.Empty;
            
        public double AverageRating { get; set; }
        public int RatingsCount { get; set; }

        public string? PosterUrl { get; set; } = string.Empty;
          
        public List<string> Genres { get; set; } = new List<string>();

        public Season? Season { get; set; }
        public string? SeasonName => Season.ToString();
        public Status Status { get; set; }
        public string StatusName => Status.ToString();

        public Models.Type Type { get; set; }
        public string TypeName => Type.ToString();

        public DateTime CreatedAt { get; set; }
    }
}
