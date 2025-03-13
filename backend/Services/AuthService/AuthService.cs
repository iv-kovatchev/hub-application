
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
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

    public async Task<string?> LoginUser(string username, string password)
    {
        User? user = await _userRepository.GetUserByUsername(username);
        if (user == null) return null;

        bool isPasswordValid = await _userRepository.CheckPassword(user, password);
        if (!isPasswordValid) return null;

        return await GenerateJwtToken(user);
    }

    private async Task<string> GenerateJwtToken(User user)
    {
        var secretKey = _configuration["Jwt:SecretKey"];
        if (string.IsNullOrEmpty(secretKey))
        {
            throw new Exception("JWT Secret Key is missing!");
        }

        var key = Encoding.UTF8.GetBytes(secretKey);

        var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName!)
            };

        var roles = await _userRepository.GetUserRoles(user);
        Console.WriteLine($"Roles for {user.UserName}: {string.Join(", ", roles)}");
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var token = new JwtSecurityToken(
            expires: DateTime.UtcNow.AddHours(3),
            claims: claims,
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}