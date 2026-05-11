using anime_backend.DTOs.Auth;
using anime_backend.DTOs.User;

namespace anime_backend.Interfaces
{
    public interface IUserService
    {
        Task<List<UserResponseDto>> GetAllUsersAsync();
        Task<UserResponseDto> GetUserByIdAsync(int id);
        Task<UserResponseDto> CreateUserAsync(CreateUserDto dto);
        Task<bool> VerifyUserAsync(int userId, bool isVerify, int adminId, string adminUsername);
        Task<bool> BlockUserAsync(int userId, bool isBlocked, int adminId, string adminUsername);
    }
}
