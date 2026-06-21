using anime_backend.DTOs.Subscribe;
using anime_backend.Models;

namespace anime_backend.Interfaces
{
    public interface ISubscribeService
    {
        Task<SubscribeResponseDto> ActiveSubscribe(int userId, int days);
        Task<bool> RemoveSubscribe(int userId);
    }
}
