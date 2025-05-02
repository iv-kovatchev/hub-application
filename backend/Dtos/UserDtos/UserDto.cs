public class UserDto
{
    public required string Id { get; set; }

    public required string Username { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Location { get; set; }

    public string? ProfileImg { get; set; }

    public bool IsBanned { get; set; }
}