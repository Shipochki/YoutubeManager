using Application.DTOs;
using Application.Interfaces;
using Domain;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class FinancialsService(AppDbContext db) : IFinancialsService
{
    // ── Project Expenses ──────────────────────────────────────────────────────

    public async Task<List<ProjectExpenseDto>> GetExpensesAsync(int userId, int projectId)
    {
        var owned = await ProjectOwnedAsync(userId, projectId);
        if (!owned) return [];

        return await db.ProjectExpenses
            .Where(e => e.ProjectId == projectId)
            .OrderByDescending(e => e.Date)
            .Select(e => ToExpenseDto(e))
            .ToListAsync();
    }

    public async Task<ProjectExpenseDto?> AddExpenseAsync(int userId, int projectId, CreateProjectExpenseRequest request)
    {
        var owned = await ProjectOwnedAsync(userId, projectId);
        if (!owned) return null;

        var expense = new ProjectExpense
        {
            ProjectId = projectId,
            Description = request.Description,
            Amount = request.Amount,
            Category = request.Category,
            Date = request.Date.ToUniversalTime(),
            CreatedAt = DateTime.UtcNow,
        };
        db.ProjectExpenses.Add(expense);
        await db.SaveChangesAsync();
        return ToExpenseDto(expense);
    }

    public async Task<bool> DeleteExpenseAsync(int userId, int projectId, int id)
    {
        var expense = await db.ProjectExpenses
            .Include(e => e.Project)
            .FirstOrDefaultAsync(e => e.Id == id && e.ProjectId == projectId && e.Project.UserId == userId);
        if (expense is null) return false;

        db.ProjectExpenses.Remove(expense);
        await db.SaveChangesAsync();
        return true;
    }

    // ── Revenue Entries ───────────────────────────────────────────────────────

    public async Task<List<RevenueEntryDto>> GetRevenueAsync(int userId, int projectId)
    {
        var owned = await ProjectOwnedAsync(userId, projectId);
        if (!owned) return [];

        return await db.RevenueEntries
            .Where(r => r.ProjectId == projectId)
            .OrderByDescending(r => r.Date)
            .Select(r => ToRevenueDto(r))
            .ToListAsync();
    }

    public async Task<RevenueEntryDto?> AddRevenueAsync(int userId, int projectId, CreateRevenueEntryRequest request)
    {
        var owned = await ProjectOwnedAsync(userId, projectId);
        if (!owned) return null;

        var entry = new RevenueEntry
        {
            ProjectId = projectId,
            Source = request.Source,
            Amount = request.Amount,
            Date = request.Date.ToUniversalTime(),
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow,
        };
        db.RevenueEntries.Add(entry);
        await db.SaveChangesAsync();
        return ToRevenueDto(entry);
    }

    public async Task<bool> DeleteRevenueAsync(int userId, int projectId, int id)
    {
        var entry = await db.RevenueEntries
            .Include(r => r.Project)
            .FirstOrDefaultAsync(r => r.Id == id && r.ProjectId == projectId && r.Project.UserId == userId);
        if (entry is null) return false;

        db.RevenueEntries.Remove(entry);
        await db.SaveChangesAsync();
        return true;
    }

    // ── Time Logs ─────────────────────────────────────────────────────────────

    public async Task<List<TimeLogDto>> GetTimeLogsAsync(int userId, int projectId)
    {
        var owned = await ProjectOwnedAsync(userId, projectId);
        if (!owned) return [];

        return await db.TimeLogs
            .Where(t => t.ProjectId == projectId)
            .OrderByDescending(t => t.Date)
            .Select(t => ToTimeLogDto(t))
            .ToListAsync();
    }

    public async Task<TimeLogDto?> AddTimeLogAsync(int userId, int projectId, CreateTimeLogRequest request)
    {
        var owned = await ProjectOwnedAsync(userId, projectId);
        if (!owned) return null;

        var log = new TimeLog
        {
            ProjectId = projectId,
            Category = request.Category,
            Hours = request.Hours,
            Date = request.Date.ToUniversalTime(),
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow,
        };
        db.TimeLogs.Add(log);
        await db.SaveChangesAsync();
        return ToTimeLogDto(log);
    }

    public async Task<bool> DeleteTimeLogAsync(int userId, int projectId, int id)
    {
        var log = await db.TimeLogs
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == id && t.ProjectId == projectId && t.Project.UserId == userId);
        if (log is null) return false;

        db.TimeLogs.Remove(log);
        await db.SaveChangesAsync();
        return true;
    }

    // ── Profitability ─────────────────────────────────────────────────────────

    public async Task<ProfitabilityDto?> GetProfitabilityAsync(int userId, int projectId)
    {
        var project = await db.Projects
            .Include(p => p.Expenses)
            .Include(p => p.RevenueEntries)
            .Include(p => p.TimeLogs)
            .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

        if (project is null) return null;

        var totalRevenue = project.RevenueEntries.Sum(r => r.Amount);
        var totalDirectExpenses = project.Expenses.Sum(e => e.Amount);
        var grossProfit = totalRevenue - totalDirectExpenses;
        var totalHours = project.TimeLogs.Sum(t => t.Hours);
        decimal? revenuePerHour = totalHours > 0 ? totalRevenue / totalHours : null;

        var monthlyRecurringTotal = await db.RecurringExpenses
            .Where(r => r.UserId == userId && r.IsActive)
            .SumAsync(r => r.Amount);

        int publishedProjectsThisMonth = 0;
        decimal autoAllocatedRecurring = 0;

        if (project.PublishedDate.HasValue)
        {
            var pub = project.PublishedDate.Value;
            publishedProjectsThisMonth = await db.Projects.CountAsync(p =>
                p.UserId == userId &&
                p.Status == ProjectStatus.Published &&
                p.PublishedDate.HasValue &&
                p.PublishedDate.Value.Year == pub.Year &&
                p.PublishedDate.Value.Month == pub.Month);

            autoAllocatedRecurring = publishedProjectsThisMonth > 0
                ? monthlyRecurringTotal / publishedProjectsThisMonth
                : 0;
        }

        var netProfitAuto = grossProfit - autoAllocatedRecurring;
        var totalCostAuto = totalDirectExpenses + autoAllocatedRecurring;
        decimal? roiAuto = totalCostAuto > 0 ? netProfitAuto / totalCostAuto : null;

        var expensesByCategory = project.Expenses
            .GroupBy(e => e.Category)
            .Select(g => new CategoryBreakdown(g.Key, g.Sum(e => e.Amount)))
            .OrderByDescending(c => c.Total)
            .ToList();

        var timeByCategory = project.TimeLogs
            .GroupBy(t => t.Category)
            .Select(g => new TimeBreakdown(g.Key, g.Sum(t => t.Hours)))
            .OrderByDescending(c => c.Hours)
            .ToList();

        return new ProfitabilityDto(
            totalRevenue,
            totalDirectExpenses,
            grossProfit,
            totalHours,
            revenuePerHour,
            monthlyRecurringTotal,
            publishedProjectsThisMonth,
            autoAllocatedRecurring,
            netProfitAuto,
            roiAuto,
            expensesByCategory,
            timeByCategory);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private async Task<bool> ProjectOwnedAsync(int userId, int projectId) =>
        await db.Projects.AnyAsync(p => p.Id == projectId && p.UserId == userId);

    private static ProjectExpenseDto ToExpenseDto(ProjectExpense e) =>
        new(e.Id, e.Description, e.Amount, e.Category, e.Date, e.CreatedAt);

    private static RevenueEntryDto ToRevenueDto(RevenueEntry r) =>
        new(r.Id, r.Source, r.Amount, r.Date, r.Notes, r.CreatedAt);

    private static TimeLogDto ToTimeLogDto(TimeLog t) =>
        new(t.Id, t.Category, t.Hours, t.Date, t.Notes, t.CreatedAt);
}
