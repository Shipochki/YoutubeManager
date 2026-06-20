namespace Domain;

public enum ProjectStatus { Draft, InProgress, Published, Archived }

public class Project
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ProjectStatus Status { get; set; } = ProjectStatus.Draft;
    public DateTime? TargetPublishDate { get; set; }
    public DateTime? PublishedDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public User User { get; set; } = null!;
    public ICollection<Short> Shorts { get; set; } = [];
    public ICollection<ProjectExpense> Expenses { get; set; } = [];
    public ICollection<RevenueEntry> RevenueEntries { get; set; } = [];
    public ICollection<TimeLog> TimeLogs { get; set; } = [];
}
