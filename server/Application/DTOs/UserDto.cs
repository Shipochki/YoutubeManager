namespace Application.DTOs;

public record UserDto(int Id, string SupabaseId, string Email, DateTime CreatedAt);
