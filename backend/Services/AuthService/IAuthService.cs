public interface IAuthService {
    Task<User> RegisterUser(string username, string password, string? firstName, string? lastName, string? location, string? profileImg);
    Task<AuthResponse?> LoginUser(string username, string password);
    Task<bool> Logout(string refreshToken);
}