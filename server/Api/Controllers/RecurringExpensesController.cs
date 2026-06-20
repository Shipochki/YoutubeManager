using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers;

[ApiController]
[Route("api/recurring-expenses")]
[Authorize]
public class RecurringExpensesController(
    IRecurringExpenseService recurringExpenseService,
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
    public async Task<ActionResult<List<RecurringExpenseDto>>> GetAll()
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        return Ok(await recurringExpenseService.GetAllAsync(userId.Value));
    }

    [HttpPost]
    public async Task<ActionResult<RecurringExpenseDto>> Create([FromBody] CreateRecurringExpenseRequest request)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        var expense = await recurringExpenseService.CreateAsync(userId.Value, request);
        return CreatedAtAction(nameof(GetAll), expense);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<RecurringExpenseDto>> Update(int id, [FromBody] UpdateRecurringExpenseRequest request)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        var expense = await recurringExpenseService.UpdateAsync(userId.Value, id, request);
        if (expense is null) return NotFound();
        return Ok(expense);
    }

    [HttpPatch("{id:int}/toggle")]
    public async Task<IActionResult> Toggle(int id)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        var found = await recurringExpenseService.ToggleActiveAsync(userId.Value, id);
        if (!found) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        var found = await recurringExpenseService.DeleteAsync(userId.Value, id);
        if (!found) return NotFound();
        return NoContent();
    }
}
