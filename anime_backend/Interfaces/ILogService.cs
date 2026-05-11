using anime_backend.Models;

namespace anime_backend.Interfaces
{
    public interface ILogService
    {
        Task<List<LogEntry>> GetRecentLogsAsync(int count = 100);
        Task<string> GetLogsAsync(int lines = 100);
    }
}
