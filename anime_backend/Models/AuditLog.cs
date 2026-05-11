namespace anime_backend.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        public int AdminId { get; set; }
        public string AdminUsername { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public int TargetUserId { get; set; }
        public string TargetUsername { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
