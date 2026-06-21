namespace Application.DTOs;

public record DashboardProjectDto(
    int Id,
    string Title,
    string Status,
    DateTime? PublishedDate,
    decimal GrossProfit,
    decimal TotalHours
);

public record DashboardDto(
    decimal MonthlyRecurringTotal,
    int PublishedProjectsThisMonth,
    int TotalProjects,
    decimal TotalRevenue,
    decimal TotalDirectExpenses,
    decimal TotalGrossProfit,
    decimal TotalHours,
    List<DashboardProjectDto> RecentProjects
);
