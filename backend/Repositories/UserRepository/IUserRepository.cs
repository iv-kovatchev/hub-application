public interface IUserRepository {
    Task<IEnumerable<User>> GetAllUsers();

    Task<User?> GetUserByUsername(string username);

    Task<User?> GetUserById(string id);

    Task<User> CreateUser(User user, string password);

    Task<bool> CheckPassword(User user, string password);

    Task AssignRole(User user, string role);

    Task<List<string>> GetUserRoles(User user);

    Task UpdateUser(User user);

    Task<User?> GetUserByRefreshToken(string refreshToken);
}