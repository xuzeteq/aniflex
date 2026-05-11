using System.ComponentModel.DataAnnotations;

namespace anime_backend.DTOs.Auth
{
    public class RegisterDto
    {
        [EmailAddress]
        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
