namespace Application.DTOs;

public record RecurringExpenseDto(
    int Id,
    string Name,
    string? Description,
    decimal Amount,
    string Category,
    bool IsActive,
    DateTime CreatedAt
);

public record CreateRecurringExpenseRequest(
    string Name,
    string? Description,
    decimal Amount,
    string Category
);

public record UpdateRecurringExpenseRequest(
    string Name,
    string? Description,
    decimal Amount,
    string Category,
    bool IsActive
);
