using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers;

[ApiController]
[Route("api/projects")]
[Authorize]
public class ProjectsController(
    IProjectService projectService,
    IUserService userService) : ControllerBase
{
    private async Task<int?> GetUserIdAsync()
    {
        var supabaseId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        var email = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue("email") ?? string.Empty;
        if (string.IsNullOrEmpty(supabaseId)) return null;
        var user = await userService.GetOrCreateUserAsync(supabaseId, email);
        return user.Id;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProjectDto>>> GetAll()
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        return Ok(await projectService.GetAllAsync(userId.Value));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProjectDetailDto>> GetById(int id)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        var project = await projectService.GetByIdAsync(userId.Value, id);
        if (project is null) return NotFound();
        return Ok(project);
    }

    [HttpPost]
    public async Task<ActionResult<ProjectDetailDto>> Create([FromBody] CreateProjectRequest request)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        var project = await projectService.CreateAsync(userId.Value, request);
        return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProjectDetailDto>> Update(int id, [FromBody] UpdateProjectRequest request)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        var project = await projectService.UpdateAsync(userId.Value, id, request);
        if (project is null) return NotFound();
        return Ok(project);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        var found = await projectService.DeleteAsync(userId.Value, id);
        if (!found) return NotFound();
        return NoContent();
    }

    [HttpPost("{projectId:int}/shorts")]
    public async Task<ActionResult<ShortDto>> AddShort(int projectId, [FromBody] CreateShortRequest request)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        var s = await projectService.AddShortAsync(userId.Value, projectId, request);
        if (s is null) return NotFound();
        return Ok(s);
    }

    [HttpDelete("{projectId:int}/shorts/{shortId:int}")]
    public async Task<IActionResult> DeleteShort(int projectId, int shortId)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        var found = await projectService.DeleteShortAsync(userId.Value, projectId, shortId);
        if (!found) return NotFound();
        return NoContent();
    }
}
