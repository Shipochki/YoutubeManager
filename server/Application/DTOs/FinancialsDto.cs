namespace Application.DTOs;

public record CategoryBreakdown(string Category, decimal Total);
public record TimeBreakdown(string Category, decimal Hours);

public record ProfitabilityDto(
    decimal TotalRevenue,
    decimal TotalDirectExpenses,
    decimal GrossProfit,
    decimal TotalHours,
    decimal? RevenuePerHour,
    decimal MonthlyRecurringTotal,
    int PublishedProjectsThisMonth,
    decimal AutoAllocatedRecurring,
    decimal NetProfitAuto,
    decimal? RoiAuto,
    List<CategoryBreakdown> ExpensesByCategory,
    List<TimeBreakdown> TimeByCategory
);

public record ProjectExpenseDto(
    int Id,
    string Description,
    decimal Amount,
    string Category,
    DateTime Date,
    DateTime CreatedAt
);

public record CreateProjectExpenseRequest(
    string Description,
    decimal Amount,
    string Category,
    DateTime Date
);

public record RevenueEntryDto(
    int Id,
    string Source,
    decimal Amount,
    DateTime Date,
    string? Notes,
    DateTime CreatedAt
);

public record CreateRevenueEntryRequest(
    string Source,
    decimal Amount,
    DateTime Date,
    string? Notes
);

public record TimeLogDto(
    int Id,
    string Category,
    decimal Hours,
    DateTime Date,
    string? Notes,
    DateTime CreatedAt
);

public record CreateTimeLogRequest(
    string Category,
    decimal Hours,
    DateTime Date,
    string? Notes
);
