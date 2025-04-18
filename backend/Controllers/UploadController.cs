using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/upload")]
[ApiController]
[Authorize]
public class UploadController : ControllerBase {
    [HttpPost("image/{uploadType}")]
    public async Task<IActionResult> UploadImagE([FromRoute] string uploadType, [FromForm] ImageUploadRequest request) {
        var image = request.Image;
        
        if (image == null || image.Length == 0) {
            return BadRequest(new { message = "No file provided." });
        }

        var allowedTypes = new[] { "users", "channels" };
        if (!allowedTypes.Contains(uploadType.ToLower()))
            return BadRequest(new { message = "Invalid upload type." });

        var allowedExtensions = new [] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(image.FileName).ToLowerInvariant();

        if(!allowedExtensions.Contains(extension)) {
            return BadRequest(new { message = "Only .jpg, .jpeg, .png and .webp files are allowed." });
        }

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", uploadType);

        if(!Directory.Exists(uploadsFolder)) {
            Directory.CreateDirectory(uploadsFolder);
        }

        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await image.CopyToAsync(stream);
        }

        var imageUrl = $"/images/{uploadType}/{fileName}";
        return Ok(new { imageUrl });
    }
}