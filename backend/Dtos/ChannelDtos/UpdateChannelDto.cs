using System.ComponentModel.DataAnnotations;

public class UpdateChannelDto {
    [Required]
    [MaxLength(100)]
    public required string Name { get; set; }

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }
}