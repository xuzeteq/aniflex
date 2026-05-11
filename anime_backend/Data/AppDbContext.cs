using anime_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace anime_backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<AnimeItem> AnimeItem { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Episode> Episodes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Favourite> Favourites { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<Rating> Ratings { get; set; }
    }
}
