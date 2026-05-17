using anime_backend.Models;

namespace anime_backend.Interfaces
{
    public interface IRelatedAnimeService
    {
        Task CreateRelatedAnime(int sourceId, int targetId);
        Task RemoveRelated(int sourceId, int targetId);
        Task<List<AnimeItem>> GetRelatedAnime(int animeId);
    }
}
