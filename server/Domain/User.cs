namespace Domain;

public class User
{
    public int Id { get; set; }
    public string SupabaseId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public ICollection<Project> Projects { get; set; } = [];
    public ICollection<RecurringExpense> RecurringExpenses { get; set; } = [];
}
