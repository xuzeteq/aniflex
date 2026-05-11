using anime_backend.Interfaces;
using anime_backend.Models;

namespace anime_backend.Services
{
    public class LogService : ILogService
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<LogService> _logger;

        public LogService(IWebHostEnvironment env, ILogger<LogService> logger)
        {
            _env = env;
            _logger = logger;
        }

        public async Task<string> GetLogsAsync(int lines = 100)
        {
            var logDir = Path.Combine(_env.ContentRootPath, "logs");

            if (!Directory.Exists(logDir))
                return "Логи не найдены";

            var logFiles = Directory.GetFiles(logDir, "app.log");
            if (!logFiles.Any())
                return "Логи не найдены";

            var latestLogFile = logFiles.OrderByDescending(f => f).First();

            using var stream = new FileStream(latestLogFile, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            using var reader = new StreamReader(stream);

            var allLines = new List<string>();
            string? line;
            while ((line = await reader.ReadLineAsync()) != null)
            {
                allLines.Add(line);
            }

            var recentLines = allLines.Skip(Math.Max(0, allLines.Count - lines)).ToList();

            return string.Join(Environment.NewLine, recentLines);
        }

        public async Task<List<LogEntry>> GetRecentLogsAsync(int count = 100)
        {
            var logDir = Path.Combine(_env.ContentRootPath, "logs");

            if (!Directory.Exists(logDir))
                return new List<LogEntry>();

            var logFiles = Directory.GetFiles(logDir, "app.log");
            if (!logFiles.Any())
                return new List<LogEntry>();

            var latestLogFile = logFiles.OrderByDescending(f => f).First();

            using var stream = new FileStream(latestLogFile, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            using var reader = new StreamReader(stream);

            var allLines = new List<string>();
            string? line;
            while ((line = await reader.ReadLineAsync()) != null)
            {
                allLines.Add(line);
            }

            var recentLines = allLines.Skip(Math.Max(0, allLines.Count - count)).ToList();

            var logs = new List<LogEntry>();

            foreach (var logLine in recentLines)
            {
                var log = ParseLogLine(logLine);
                if (log != null)
                    logs.Add(log);
            }

            return logs;
        }

        private LogEntry? ParseLogLine(string line)
        {
            try
            {
                // Проверяем, что строка начинается с [
                if (!line.StartsWith("[")) return null;

                var firstCloseBracket = line.IndexOf(']');
                if (firstCloseBracket == -1) return null;

                // Извлекаем содержимое внутри скобок: "2026-05-02 13:55:43.901 +03:00 INF"
                var bracketContent = line.Substring(1, firstCloseBracket - 1).Trim();

                // Разделяем по пробелам: последняя часть - это уровень
                var parts = bracketContent.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                if (parts.Length < 2) return null; // Минимум: дата и уровень

                // Уровень - последний элемент (INF, ERR, WRN и т.д.)
                var level = parts[^1]; // C# 8.0+: индекс с конца

                // Дата/время - всё, кроме последнего элемента
                var timestampStr = string.Join(" ", parts, 0, parts.Length - 1);

                // Остальная часть лога после закрывающей скобки
                var message = line.Substring(firstCloseBracket + 1).Trim();

                return new LogEntry
                {
                    Timestamp = DateTime.Parse(timestampStr),
                    Level = level,
                    Message = message,
                    Raw = line
                };
            }
            catch (Exception ex)
            {
                // Опционально: логирование ошибки через Debug.WriteLine или ваш логгер
                return new LogEntry
                {
                    Timestamp = DateTime.Now,
                    Level = "???",
                    Message = line,
                    Raw = line
                };
            }
        }
    }
}