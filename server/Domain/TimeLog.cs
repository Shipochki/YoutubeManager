namespace Domain;

public class TimeLog
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Category { get; set; } = string.Empty;
    public decimal Hours { get; set; }
    public string? Notes { get; set; }
    public DateTime Date { get; set; }
    public DateTime CreatedAt { get; set; }

    public Project Project { get; set; } = null!;
}
