using anime_backend.Interfaces;
using anime_backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace anime_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogController : ControllerBase
    {
        private readonly ILogService _logService;

        public LogController(ILogService logService)
        {
            _logService = logService;
        }

        [HttpGet("logs")]
        public async Task<IActionResult> GetLogs([FromQuery] int lines = 100)
        {
            var logs = await _logService.GetRecentLogsAsync(lines);
            return Ok(logs);
        }

        [HttpGet("Raw")]
        public async Task<IActionResult> GetRawLogs([FromQuery] int lines = 100)
        {
            var logs = await _logService.GetLogsAsync(lines);
            return Ok(logs);
        }
    }
}
