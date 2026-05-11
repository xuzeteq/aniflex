using anime_backend.DTOs.Episode;

namespace anime_backend.Interfaces
{
    public interface IEpisodeService
    {
        Task<List<EpisodeResponseDto>> GetAllEpisodesAsync();
        Task<EpisodeResponseDto> GetEpisodeByIdAsync(int id);
        Task<List<EpisodeResponseDto>> GetlEpisodesByAnimeIdAsync(int animeId);
        Task<EpisodeResponseDto> CreateEpisodeAsync(CreateEpisodeDto dto);
    }
}
