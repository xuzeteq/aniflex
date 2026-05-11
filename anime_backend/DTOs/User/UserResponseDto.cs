namespace anime_backend.DTOs.User
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public bool IsVerify { get; set; }
        public bool IsBlocked { get; set; }
        public int FavouritesCount { get; set; }
        public int RatingsCount { get; set; }

        public string Role { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
