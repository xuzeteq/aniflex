namespace anime_backend.Models
{
    public class AnimeItem
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
    
        public string? PosterUrl { get; set; } = string.Empty;

        public double AverageRating { get; set; }
        public int RatingsCount { get; set; }

        public Season? Season { get; set; }
        public Status Status { get; set; }
        public Type Type { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<AnimeGenre> AnimeGenres { get; set; } = new List<AnimeGenre>();
    }

    public enum Status
    {
        Вышло,
        Онгоинг,
        Анонс
    }

    public enum Type
    {
        Сериал,
        Фильм,
        OVA,
        ONA
    }

    public enum Season
    {
        Зима,
        Весна,
        Лето,
        Осень
    }
}
