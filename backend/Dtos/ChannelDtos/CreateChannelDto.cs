using System.ComponentModel.DataAnnotations;

public class CreateChannelDto {
    [Required]
    [MaxLength(100)]
    public required string Name { get; set; }

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }
}