using anime_backend.DTOs.AnimeItem;

namespace anime_backend.Interfaces
{
    public interface IAnimeItemService
    {
        Task<List<AnimeItemResponseDto>> GetAllAnimeAsync(); 
        Task<AnimeItemResponseDto> GetAnimeByIdAsync(int id);
        Task<List<AnimeItemResponseDto>> GetOngoingAnimeAsync();
        Task<List<AnimeItemResponseDto>> GetAnimeCurrentSeasonAsync();
        Task<AnimeItemResponseDto> GetRandomAnimeAsync();
        Task<List<AnimeItemResponseDto>> GetNewAnimeAsync();
        Task<AnimeItemResponseDto> CreateAnimeAsync(CreateAnimeItemDto dto);
        Task<AnimeItemResponseDto> PatchAnimeAsync(PatchAnimeItemDto dto, int id);
        Task<AnimeItemResponseDto> PutAnimeAsync(PutAnimeItemDto dto, int id);

        Task AddGenreToAnime(int animeId, int GenreId);
    }
}
