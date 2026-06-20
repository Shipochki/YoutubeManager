using Application.DTOs;

namespace Application.Interfaces;

public interface IUserService
{
    Task<UserDto> GetOrCreateUserAsync(string supabaseId, string email);
}
