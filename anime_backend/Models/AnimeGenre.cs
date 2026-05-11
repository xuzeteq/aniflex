namespace anime_backend.Models
{
    public class AnimeGenre
    {
        public int Id { get; set; }

        public int AnimeItemId { get; set; }
        public AnimeItem AnimeItem { get; set; } = null!;

        public int GenreId { get; set; }
        public Genre Genre { get; set; } = null!;

    }
}
