namespace anime_backend.Models
{
    public class Rating
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public int AnimeId { get; set; }
        public AnimeItem? Anime { get; set; }

        public int Value { get; set; } // ot 1 do 10

        public DateTime CreatedAt { get; set; }
    }
}
