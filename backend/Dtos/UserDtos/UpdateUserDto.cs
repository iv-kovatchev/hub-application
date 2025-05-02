using System.ComponentModel.DataAnnotations;

public class UpdateUserDto
{
    [MaxLength(100)]
    public string? FirstName { get; set; }

    [MaxLength(100)]
    public string? LastName { get; set; }

    [MaxLength(100)]
    public string? Location { get; set; }

    // TODO:
    // public string? ProfileImg { get; set; }
}