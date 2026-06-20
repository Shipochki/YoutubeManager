using Application.DTOs;

namespace Application.Interfaces;

public interface IProjectService
{
    Task<List<ProjectDto>> GetAllAsync(int userId);
    Task<ProjectDetailDto?> GetByIdAsync(int userId, int id);
    Task<ProjectDetailDto> CreateAsync(int userId, CreateProjectRequest request);
    Task<ProjectDetailDto?> UpdateAsync(int userId, int id, UpdateProjectRequest request);
    Task<bool> DeleteAsync(int userId, int id);
    Task<ShortDto?> AddShortAsync(int userId, int projectId, CreateShortRequest request);
    Task<bool> DeleteShortAsync(int userId, int projectId, int shortId);
}
