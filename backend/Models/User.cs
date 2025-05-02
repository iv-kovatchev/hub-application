using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

public class User : IdentityUser
{
    [MaxLength(50)]
    public string? FirstName { get; set; }

    [MaxLength(50)]
    public string? LastName { get; set; }

    [MaxLength(50)]
    public string? Location { get; set; }

    [MaxLength(500)]
    public string? ProfileImg { get; set; }

    public string? RefreshToken { get; set; }
    
    public DateTime RefreshTokenExpiryTime { get; set; }

    public bool IsBanned { get; set; } = false;

    public ICollection<Channel> Channels { get; set; } = new List<Channel>();
}