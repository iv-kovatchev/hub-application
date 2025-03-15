using Microsoft.AspNetCore.Identity;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;

    private readonly UserManager<User> _userManager;

    private readonly IConfiguration _configuration;

    private readonly ITokenService _tokenService;

    public AuthService(IUserRepository userRepository, UserManager<User> userManager, IConfiguration configuration, ITokenService tokenService)
    {
        _userRepository = userRepository;
        _userManager = userManager;
        _configuration = configuration;
        _tokenService = tokenService;
    }

    public async Task<User> RegisterUser(string username, string password, string? firstName, string? lastName, string? location, string? profileImg)
    {
        User user = new User
        {
            UserName = username,
            FirstName = firstName,
            LastName = lastName,
            Location = location,
            ProfileImg = profileImg
        };

        User? result = await _userRepository.CreateUser(user, password);

        await _userRepository.AssignRole(result, "User");

        return result;
    }

    public async Task<AuthResponse?> LoginUser(string username, string password)
    {
        User? user = await _userRepository.GetUserByUsername(username);
        if (user == null) return null;

        bool isPasswordValid = await _userRepository.CheckPassword(user, password);
        if (!isPasswordValid) return null;

        return await _tokenService.GenerateJwtToken(user);
    }

    public async Task<bool> Logout(string refreshToken)
    {
        // Find the user associated with this refresh token
        var user = await _userRepository.GetUserByRefreshToken(refreshToken);
        if (user == null)
        {
            return false;
        }

        //Remove refresh token to prevent further use
        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = DateTime.MinValue;

        //Update user in database
        await _userRepository.UpdateUser(user);

        return true;
    }
}