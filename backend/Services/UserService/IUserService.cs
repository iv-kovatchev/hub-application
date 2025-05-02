public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllUsers();
    
    Task<UpdateUserDto?> UpdateUser(string id, UpdateUserDto dto);

    Task BanUser(string id);
}