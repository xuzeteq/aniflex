namespace anime_backend.Models
{
    public class Favourite
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }

        public int AnimeId { get; set; }
        public AnimeItem? Anime { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
