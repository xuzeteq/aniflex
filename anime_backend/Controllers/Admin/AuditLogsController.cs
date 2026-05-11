using anime_backend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace anime_backend.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditLogsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public AuditLogsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("audit-logs")]
        public async Task<IActionResult> GetAuditLogs([FromQuery] int lines = 100)
        {
            var logs = await _dbContext.AuditLogs.OrderByDescending(l => l.CreatedAt).Take(lines).ToListAsync();
            return Ok(logs);
        }

        [HttpGet("user-audit-logs")]
        public async Task<IActionResult> GetUserAuditLogs(int userId, [FromQuery] int lines = 100)
        {
            var logs = await _dbContext.AuditLogs.Where(u => u.TargetUserId == userId).OrderByDescending(l => l.CreatedAt).Take(lines).ToListAsync();
            return Ok(logs);
        }
    }
}
