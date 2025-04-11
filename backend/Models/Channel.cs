using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Channel
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public required string Name { get; set; }

    [MaxLength(255)]
    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    [Required]
    public required string CreatedById { get; set; }

    [ForeignKey(nameof(CreatedById))]
    public required User CreatedBy { get; set; }
}