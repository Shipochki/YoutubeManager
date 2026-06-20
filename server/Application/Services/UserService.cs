using Application.DTOs;
using Application.Interfaces;
using Domain;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class UserService(AppDbContext db) : IUserService
{
    public async Task<UserDto> GetOrCreateUserAsync(string supabaseId, string email)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.SupabaseId == supabaseId);

        if (user is null)
        {
            user = new User
            {
                SupabaseId = supabaseId,
                Email = email,
                CreatedAt = DateTime.UtcNow,
            };
            db.Users.Add(user);
            await db.SaveChangesAsync();
        }

        return new UserDto(user.Id, user.SupabaseId, user.Email, user.CreatedAt);
    }
}
