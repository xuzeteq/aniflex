namespace anime_backend.DTOs.Auth
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public int FavouritesCount { get; set; }
        public int RatingsCount { get; set; }
        public string AvatarUrl { get; set; } = string.Empty;
        public bool IsBlocked { get; set; }
        public bool IsSubscriber { get; set; }
        public bool IsVerify { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
