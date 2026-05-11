using anime_backend.DTOs.Auth;

namespace anime_backend.Interfaces
{
    public interface IAuthService
    {
        Task<UserDto> LoginAsync(LoginDto dto);
        Task<UserDto> RegisterAsync(RegisterDto dto);
        Task<UserDto> GetUserByIdAsync(int id);

    }
}
