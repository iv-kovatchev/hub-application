public class ChannelDto
{
    public Guid Id { get; set; }
    
    public required string Name { get; set; }
    
    public string? Description { get; set; }
    
    public string? ImageUrl { get; set; }

    public required string CreatedByUserName { get; set; }
}
