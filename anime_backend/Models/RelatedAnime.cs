namespace anime_backend.Models
{
    public class RelatedAnime
    {
        public int Id { get; set; }

        public int SourceAnimeId { get; set; }
        public AnimeItem SourceAnime { get; set; } = null!;

        public int TargetAnimeId { get; set; }
        public AnimeItem TargetAnime { get; set; } = null!;

        public string Text { get; set; } = string.Empty;
    }
}
