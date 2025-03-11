public interface IAuthService {
    Task<User> RegisterUser(string username, string password, string? firstName, string? lastName, string? location, string? profileImg);
    Task<string?> LoginUser(string username, string password);
}