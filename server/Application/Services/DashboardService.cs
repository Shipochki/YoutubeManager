using Application.DTOs;
using Application.Interfaces;
using Domain;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class DashboardService(AppDbContext db) : IDashboardService
{
    public async Task<DashboardDto> GetDashboardAsync(int userId)
    {
        var now = DateTime.UtcNow;

        var monthlyRecurringTotal = await db.RecurringExpenses
            .Where(r => r.UserId == userId && r.IsActive)
            .SumAsync(r => (decimal?)r.Amount) ?? 0m;

        var publishedProjectsThisMonth = await db.Projects
            .CountAsync(p =>
                p.UserId == userId &&
                p.Status == ProjectStatus.Published &&
                p.PublishedDate.HasValue &&
                p.PublishedDate.Value.Year == now.Year &&
                p.PublishedDate.Value.Month == now.Month);

        var projects = await db.Projects
            .Where(p => p.UserId == userId)
            .Select(p => new
            {
                p.Id,
                p.Title,
                p.Status,
                p.PublishedDate,
                Revenue = p.RevenueEntries.Sum(r => (decimal?)r.Amount) ?? 0m,
                Expenses = p.Expenses.Sum(e => (decimal?)e.Amount) ?? 0m,
                Hours = p.TimeLogs.Sum(t => (decimal?)t.Hours) ?? 0m,
            })
            .ToListAsync();

        var totalRevenue = projects.Sum(p => p.Revenue);
        var totalDirectExpenses = projects.Sum(p => p.Expenses);
        var totalHours = projects.Sum(p => p.Hours);

        var recentProjects = projects
            .Where(p => p.Status == ProjectStatus.Published && p.PublishedDate.HasValue)
            .OrderByDescending(p => p.PublishedDate)
            .Take(5)
            .Select(p => new DashboardProjectDto(
                p.Id,
                p.Title,
                p.Status.ToString(),
                p.PublishedDate,
                p.Revenue - p.Expenses,
                p.Hours))
            .ToList();

        return new DashboardDto(
            monthlyRecurringTotal,
            publishedProjectsThisMonth,
            projects.Count,
            totalRevenue,
            totalDirectExpenses,
            totalRevenue - totalDirectExpenses,
            totalHours,
            recentProjects);
    }
}
