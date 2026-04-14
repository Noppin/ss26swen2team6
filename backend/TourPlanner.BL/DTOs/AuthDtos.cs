namespace TourPlanner.BL.DTOs;

public record RegisterRequest(string Username, string Email, string Password);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string AccessToken, Guid UserId, string Username, string Email);
