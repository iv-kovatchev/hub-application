using System.Reflection.Metadata.Ecma335;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsers()
    {
        var users = await _userRepository.GetAllUsers();

        return users.Select(u => new UserDto
        {
            Id = u.Id,
            Username = u.UserName!,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Location = u.Location,
            ProfileImg = u.ProfileImg,
            IsBanned = u.IsBanned
        });
    }

    public async Task<UserDto?> GetUserById(string id)
    {
        var user = await _userRepository.GetUserById(id);

        if (user == null)
        {
            return null;
        }

        return new UserDto
        {
            Id = user.Id,
            Username = user.UserName!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Location = user.Location,
            IsBanned = user.IsBanned,
            ProfileImg = user.ProfileImg
        };
    }

    public async Task<UpdateUserDto?> UpdateUser(string id, UpdateUserDto dto)
    {
        var user = await _userRepository.GetUserById(id);

        if (user == null)
        {
            return null;
        }

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.Location = dto.Location;

        await _userRepository.UpdateUser(user);

        return new UpdateUserDto
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            Location = user.Location
        };
    }

    public async Task BanUser(string id)
    {
        var user = await _userRepository.GetUserById(id)
            ?? throw new Exception("User not found.");

        var roles = await _userRepository.GetUserRoles(user);
        if (roles.Contains("Admin"))
        {
            throw new Exception("Cannot ban admin user.");
        }

        if (user.IsBanned)
        {
            throw new Exception("User is already banned.");
        }

        user.IsBanned = true;

        await _userRepository.UpdateUser(user);
    }
}