namespace Application.DTOs;

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
