using Application.DTOs;
using Application.Interfaces;
using Domain;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class ProjectService(AppDbContext db) : IProjectService
{
    public async Task<List<ProjectDto>> GetAllAsync(int userId)
    {
        return await db.Projects
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new ProjectDto(
                p.Id,
                p.Title,
                p.Description,
                p.Status.ToString(),
                p.TargetPublishDate,
                p.PublishedDate,
                p.CreatedAt,
                p.UpdatedAt,
                p.Shorts.Count,
                (p.RevenueEntries.Sum(r => (decimal?)r.Amount) ?? 0m) - (p.Expenses.Sum(e => (decimal?)e.Amount) ?? 0m),
                p.TimeLogs.Sum(t => (decimal?)t.Hours) ?? 0m))
            .ToListAsync();
    }

    public async Task<ProjectDetailDto?> GetByIdAsync(int userId, int id)
    {
        var project = await db.Projects
            .Include(p => p.Shorts)
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        return project is null ? null : ToDetailDto(project);
    }

    public async Task<ProjectDetailDto> CreateAsync(int userId, CreateProjectRequest request)
    {
        var project = new Project
        {
            UserId = userId,
            Title = request.Title,
            Description = request.Description,
            Status = ParseStatus(request.Status),
            TargetPublishDate = request.TargetPublishDate,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        db.Projects.Add(project);
        await db.SaveChangesAsync();
        return ToDetailDto(project);
    }

    public async Task<ProjectDetailDto?> UpdateAsync(int userId, int id, UpdateProjectRequest request)
    {
        var project = await db.Projects
            .Include(p => p.Shorts)
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        if (project is null) return null;

        project.Title = request.Title;
        project.Description = request.Description;
        project.Status = ParseStatus(request.Status);
        project.TargetPublishDate = request.TargetPublishDate;
        project.PublishedDate = request.PublishedDate;
        project.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return ToDetailDto(project);
    }

    public async Task<bool> DeleteAsync(int userId, int id)
    {
        var project = await db.Projects
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        if (project is null) return false;

        db.Projects.Remove(project);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<ShortDto?> AddShortAsync(int userId, int projectId, CreateShortRequest request)
    {
        var project = await db.Projects
            .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
        if (project is null) return null;

        var s = new Short
        {
            ProjectId = projectId,
            Title = request.Title,
            YoutubeUrl = request.YoutubeUrl,
            PublishedDate = request.PublishedDate,
            CreatedAt = DateTime.UtcNow,
        };
        db.Shorts.Add(s);
        await db.SaveChangesAsync();
        return ToShortDto(s);
    }

    public async Task<bool> DeleteShortAsync(int userId, int projectId, int shortId)
    {
        var s = await db.Shorts
            .Include(s => s.Project)
            .FirstOrDefaultAsync(s => s.Id == shortId && s.ProjectId == projectId && s.Project.UserId == userId);
        if (s is null) return false;

        db.Shorts.Remove(s);
        await db.SaveChangesAsync();
        return true;
    }

    private static ProjectStatus ParseStatus(string status) =>
        Enum.TryParse<ProjectStatus>(status, out var result) ? result : ProjectStatus.Draft;

    private static ShortDto ToShortDto(Short s) =>
        new(s.Id, s.Title, s.YoutubeUrl, s.PublishedDate, s.CreatedAt);

    private static ProjectDetailDto ToDetailDto(Project p) =>
        new(p.Id, p.Title, p.Description, p.Status.ToString(),
            p.TargetPublishDate, p.PublishedDate, p.CreatedAt, p.UpdatedAt,
            p.Shorts.Select(ToShortDto).ToList());
}
