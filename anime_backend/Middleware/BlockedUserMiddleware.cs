using anime_backend.Interfaces;
using Microsoft.AspNetCore.Authentication;

namespace anime_backend.Middleware
{
    public class BlockedUserMiddleware
    {
        private readonly RequestDelegate _next;

        public BlockedUserMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IUserService userService)
        {
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var user = await userService.GetUserByNameAsync(context.User.Identity.Name!);

                if (user.IsBlocked)
                {
                    context.Response.StatusCode = 403;
                    await context.Response.WriteAsync("Account blocked, cry about this!");
                    return;
                }
            }

            await _next(context);
        }
    }
}
