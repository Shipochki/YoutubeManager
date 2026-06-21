using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController(
    IDashboardService dashboardService,
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
    public async Task<ActionResult<DashboardDto>> Get()
    {
        var userId = await GetUserIdAsync();
        if (userId is null) return Unauthorized();
        return Ok(await dashboardService.GetDashboardAsync(userId.Value));
    }
}
