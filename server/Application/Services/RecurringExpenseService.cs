using Application.DTOs;
using Application.Interfaces;
using Domain;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class RecurringExpenseService(AppDbContext db) : IRecurringExpenseService
{
    public async Task<List<RecurringExpenseDto>> GetAllAsync(int userId)
    {
        return await db.RecurringExpenses
            .Where(e => e.UserId == userId)
            .OrderBy(e => e.Name)
            .Select(e => ToDto(e))
            .ToListAsync();
    }

    public async Task<RecurringExpenseDto> CreateAsync(int userId, CreateRecurringExpenseRequest request)
    {
        var expense = new RecurringExpense
        {
            UserId = userId,
            Name = request.Name,
            Description = request.Description,
            Amount = request.Amount,
            Category = request.Category,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
        };
        db.RecurringExpenses.Add(expense);
        await db.SaveChangesAsync();
        return ToDto(expense);
    }

    public async Task<RecurringExpenseDto?> UpdateAsync(int userId, int id, UpdateRecurringExpenseRequest request)
    {
        var expense = await db.RecurringExpenses
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
        if (expense is null) return null;

        expense.Name = request.Name;
        expense.Description = request.Description;
        expense.Amount = request.Amount;
        expense.Category = request.Category;
        expense.IsActive = request.IsActive;
        await db.SaveChangesAsync();
        return ToDto(expense);
    }

    public async Task<bool> ToggleActiveAsync(int userId, int id)
    {
        var expense = await db.RecurringExpenses
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
        if (expense is null) return false;

        expense.IsActive = !expense.IsActive;
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int userId, int id)
    {
        var expense = await db.RecurringExpenses
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
        if (expense is null) return false;

        db.RecurringExpenses.Remove(expense);
        await db.SaveChangesAsync();
        return true;
    }

    private static RecurringExpenseDto ToDto(RecurringExpense e) =>
        new(e.Id, e.Name, e.Description, e.Amount, e.Category, e.IsActive, e.CreatedAt);
}
