using anime_backend.Interfaces;
using anime_backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace anime_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscribeController : ControllerBase
    {
        private readonly ISubscribeService _subscribeService;

        public SubscribeController(ISubscribeService subscribeService)
        {
            _subscribeService = subscribeService;
        }

        [HttpPost("active")]
        public async Task<Subscribe> ActiveSubscribe([Required] int userId, [Required] int days)
        {
            var userSubscribe = await _subscribeService.ActiveSubscribe(userId, days);
            return userSubscribe;
        }

        [HttpPost("remove")]
        public async Task<bool> RemoveSubscribe(int userId)
        {
            var userSubscribe = await _subscribeService.RemoveSubscribe(userId);
            return true;
        }
    }
}
