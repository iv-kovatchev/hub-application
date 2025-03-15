public interface ITokenService {
    Task<AuthResponse> GenerateJwtToken(User user);
    Task<AuthResponse?> RefreshToken(string refreshToken);
}