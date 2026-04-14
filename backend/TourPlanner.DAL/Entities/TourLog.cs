namespace TourPlanner.DAL.Entities;

public class TourLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TourId { get; set; }
    public Tour? Tour { get; set; }
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public DateTime DateTime { get; set; }
    public string Comment { get; set; } = string.Empty;
    public int Difficulty { get; set; }
    public double TotalDistance { get; set; }
    public int TotalTime { get; set; }
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
