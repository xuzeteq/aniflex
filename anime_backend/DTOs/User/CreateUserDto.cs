namespace anime_backend.DTOs.User
{
    public class CreateUserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool IsVerify { get; set; }
        public bool IsBlocked { get; set; }

        public string Role { get; set; } = string.Empty;
    }
}
