using Application.DTOs;

namespace Application.Interfaces;

public interface IRecurringExpenseService
{
    Task<List<RecurringExpenseDto>> GetAllAsync(int userId);
    Task<RecurringExpenseDto> CreateAsync(int userId, CreateRecurringExpenseRequest request);
    Task<RecurringExpenseDto?> UpdateAsync(int userId, int id, UpdateRecurringExpenseRequest request);
    Task<bool> ToggleActiveAsync(int userId, int id);
    Task<bool> DeleteAsync(int userId, int id);
}
