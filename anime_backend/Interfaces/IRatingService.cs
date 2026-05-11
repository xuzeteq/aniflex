namespace anime_backend.Interfaces
{
    public interface IRatingService
    {
        Task<double> RateAnimeAsync(int animeId, int userId, int value);
        Task<double> GetUserRatingAsync(int userId, int animeId);
    }
}
