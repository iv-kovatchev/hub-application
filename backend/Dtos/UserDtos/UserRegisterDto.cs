using System.ComponentModel.DataAnnotations;

public class UserRegisterDto
{
    [Required]
    [MinLength(4), MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? FirstName { get; set; }

    [MaxLength(50)]
    public string? LastName { get; set; }

    [MaxLength(100)]
    public string? Location { get; set; }

    public string? ProfileImg { get; set; }
}