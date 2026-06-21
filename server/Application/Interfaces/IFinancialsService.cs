using Application.DTOs;

namespace Application.Interfaces;

public interface IFinancialsService
{
    Task<List<ProjectExpenseDto>> GetExpensesAsync(int userId, int projectId);
    Task<ProjectExpenseDto?> AddExpenseAsync(int userId, int projectId, CreateProjectExpenseRequest request);
    Task<bool> DeleteExpenseAsync(int userId, int projectId, int id);

    Task<List<RevenueEntryDto>> GetRevenueAsync(int userId, int projectId);
    Task<RevenueEntryDto?> AddRevenueAsync(int userId, int projectId, CreateRevenueEntryRequest request);
    Task<bool> DeleteRevenueAsync(int userId, int projectId, int id);

    Task<List<TimeLogDto>> GetTimeLogsAsync(int userId, int projectId);
    Task<TimeLogDto?> AddTimeLogAsync(int userId, int projectId, CreateTimeLogRequest request);
    Task<bool> DeleteTimeLogAsync(int userId, int projectId, int id);

    Task<ProfitabilityDto?> GetProfitabilityAsync(int userId, int projectId);
}
