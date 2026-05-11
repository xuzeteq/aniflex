namespace anime_backend.DTOs.AnimeItem
{
    public class RatingAnimeDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int AnimeId { get; set; }
        public int Value { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
