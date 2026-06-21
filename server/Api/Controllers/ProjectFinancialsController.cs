using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers;

[ApiController]
[Route("api/projects/{projectId:int}")]
[Authorize]
public class ProjectFinancialsController(
    IFinancialsService financialsService,
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

    // ── Expenses ──────────────────────────────────────────────────────────────

    [HttpGet("expenses")]
    public async Task<ActionResult<List<ProjectExpenseDto>>> GetExpenses(int projectId)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        return Ok(await financialsService.GetExpensesAsync(userId.Value, projectId));
    }

    [HttpPost("expenses")]
    public async Task<ActionResult<ProjectExpenseDto>> AddExpense(
        int projectId, [FromBody] CreateProjectExpenseRequest request)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        var result = await financialsService.AddExpenseAsync(userId.Value, projectId, request);
        if (result is null) return NotFound();
        return Created($"api/projects/{projectId}/expenses/{result.Id}", result);
    }

    [HttpDelete("expenses/{id:int}")]
    public async Task<IActionResult> DeleteExpense(int projectId, int id)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        var found = await financialsService.DeleteExpenseAsync(userId.Value, projectId, id);
        if (!found) return NotFound();
        return NoContent();
    }

    // ── Revenue ───────────────────────────────────────────────────────────────

    [HttpGet("revenue")]
    public async Task<ActionResult<List<RevenueEntryDto>>> GetRevenue(int projectId)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        return Ok(await financialsService.GetRevenueAsync(userId.Value, projectId));
    }

    [HttpPost("revenue")]
    public async Task<ActionResult<RevenueEntryDto>> AddRevenue(
        int projectId, [FromBody] CreateRevenueEntryRequest request)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        var result = await financialsService.AddRevenueAsync(userId.Value, projectId, request);
        if (result is null) return NotFound();
        return Created($"api/projects/{projectId}/revenue/{result.Id}", result);
    }

    [HttpDelete("revenue/{id:int}")]
    public async Task<IActionResult> DeleteRevenue(int projectId, int id)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        var found = await financialsService.DeleteRevenueAsync(userId.Value, projectId, id);
        if (!found) return NotFound();
        return NoContent();
    }

    // ── Time Logs ─────────────────────────────────────────────────────────────

    [HttpGet("timelogs")]
    public async Task<ActionResult<List<TimeLogDto>>> GetTimeLogs(int projectId)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        return Ok(await financialsService.GetTimeLogsAsync(userId.Value, projectId));
    }

    [HttpPost("timelogs")]
    public async Task<ActionResult<TimeLogDto>> AddTimeLog(
        int projectId, [FromBody] CreateTimeLogRequest request)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        var result = await financialsService.AddTimeLogAsync(userId.Value, projectId, request);
        if (result is null) return NotFound();
        return Created($"api/projects/{projectId}/timelogs/{result.Id}", result);
    }

    [HttpDelete("timelogs/{id:int}")]
    public async Task<IActionResult> DeleteTimeLog(int projectId, int id)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        var found = await financialsService.DeleteTimeLogAsync(userId.Value, projectId, id);
        if (!found) return NotFound();
        return NoContent();
    }
}
